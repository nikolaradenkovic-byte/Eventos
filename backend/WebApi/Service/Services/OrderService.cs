using Core.Models;
using Core.Repositories;
using Core.Services;
using Microsoft.Extensions.Configuration;
using QRCoder;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;

namespace Service.Services
{
    internal class OrderService(IOrderRepository orderRepository, IConfiguration configuration) : IOrderService
    {
        public async Task<Order?> CreateOrder(Guid userId, List<RequestModel> requestTickets, string email, string firstName, string lastName)
        {
            OrderTickets? orderTickets = await orderRepository.CreateOrder(userId, requestTickets);
            if (orderTickets == null) return null;

            using QRCodeGenerator qrGenerator = new QRCodeGenerator();

            var ticketQrCodes = orderTickets.Tickets.Select(ticket =>
            {
                using QRCodeData qrData = qrGenerator.CreateQrCode(ticket.Id.ToString(), QRCodeGenerator.ECCLevel.Q);
                using PngByteQRCode qrCode = new PngByteQRCode(qrData);
                byte[] qrCodeBytes = qrCode.GetGraphic(20);

                return (
                    ticketId: ticket.Id,
                    QrCodeBase64: $"data:image/png;base64,{Convert.ToBase64String(qrCodeBytes)}"
                );
            }).ToList();

            await SendEmail(firstName, lastName, email, ticketQrCodes);

            return orderTickets.Order;
        }

        public async Task<Order?> CreateOrderNoAuth(RequestTickets requestTickets)
        {
            OrderTickets? orderTickets = await orderRepository.CreateOrderNoAuth(requestTickets);
            if (orderTickets == null) return null;

            using QRCodeGenerator qrGenerator = new QRCodeGenerator();

            var ticketQrCodes = orderTickets.Tickets.Select(ticket =>
            {
                using QRCodeData qrData = qrGenerator.CreateQrCode(ticket.Id.ToString(), QRCodeGenerator.ECCLevel.Q);
                using PngByteQRCode qrCode = new PngByteQRCode(qrData);
                byte[] qrCodeBytes = qrCode.GetGraphic(20);

                return (
                    ticketId: ticket.Id,
                    QrCodeBase64: $"data:image/png;base64,{Convert.ToBase64String(qrCodeBytes)}"
                );
            }).ToList();


            await SendEmail(requestTickets.firstName, requestTickets.lastName, requestTickets.email, ticketQrCodes);

            return orderTickets.Order;
        }


        public async Task SendEmail(
            string firstName,
            string lastName,
            string email,
            List<(Guid ticketId, string QrCodeBase64)> ticketQrCodes)
        {
            try
            {
                string? secret = configuration["Mail:Secret"];

                if (string.IsNullOrEmpty(secret))
                    throw new Exception("Mail secret is not configured.");

                using MailMessage mail = new MailMessage();

                mail.From = new MailAddress("eventos.noreply@gmail.com");
                mail.To.Add(email);
                mail.Subject = "Uspešno ste kupili karte";
                mail.IsBodyHtml = true;

                StringBuilder body = new StringBuilder();

                body.Append("<h2>Uspešno ste kupili karte!</h2>");
                body.Append("<p>Hvala na kupovini.</p>");
                body.Append("<p>Vaše karte se nalaze u priloženom PDF dokumentu.</p>");

                mail.Body = body.ToString();

                foreach (var ticket in ticketQrCodes)
                {
                    byte[] pdfBytes = await GenerateTicketsPdf(firstName, lastName, ticket);
                    MemoryStream pdfStream = new MemoryStream(pdfBytes);

                    Attachment attachment = new Attachment(
                        pdfStream,
                        "Karte.pdf",
                        MediaTypeNames.Application.Pdf);

                    mail.Attachments.Add(attachment);
                }

                using SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);

                smtpClient.Credentials = new NetworkCredential(
                    "eventos.noreply@gmail.com",
                    secret);

                smtpClient.EnableSsl = true;

                await smtpClient.SendMailAsync(mail);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
                throw;
            }
        }
        private async Task<byte[]> GenerateTicketsPdf(
        string firstName,
        string lastName,
        (Guid ticketId, string QrCodeBase64) ticket)
        {
            return await Task.Run(() =>
            {
                using MemoryStream stream = new MemoryStream();
                Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        page.Size(PageSizes.A4);
                        page.Margin(40);

                        page.DefaultTextStyle(x =>
                            x.FontSize(12));

                        page.Content().Column(column =>
                        {
                            column.Spacing(20);

                            column.Item()
                                .Text("Vase karta")
                                .FontSize(24)
                                .Bold();

                            column.Item()
                            .PaddingBottom(10)
                            .Column(userColumn =>
                            {
                                userColumn.Spacing(4);

                                userColumn.Item()
                                    .Text($"Kupac: {firstName} {lastName}")
                                    .FontSize(14)
                                    .SemiBold();

                                userColumn.Item()
                                    .Text($"Datum izdavanja: {DateTime.Now:dd.MM.yyyy.}")
                                    .FontSize(10)
                                    .FontColor(Colors.Grey.Medium);
                            });
                                string base64 = ticket.QrCodeBase64
                                    .Replace("data:image/png;base64,", "");

                                byte[] imageBytes =
                                    Convert.FromBase64String(base64);

                                Event? eventInfo =
                                    orderRepository.GetEventInfoById(ticket.ticketId)
                                        .GetAwaiter()
                                        .GetResult();

                                column.Item()
                                    .Border(1)
                                    .BorderColor(Colors.Grey.Lighten2)
                                    .Padding(15)
                                    .Column(ticketColumn =>
                                    {
                                        ticketColumn.Spacing(8);

                                        ticketColumn.Item()
                                            .Text($"Karta: {ticket.ticketId}")
                                            .FontSize(16)
                                            .Bold();

                                        if (eventInfo != null)
                                        {
                                            ticketColumn.Item()
                                                .Text($"Ime dogadjaja: {eventInfo.EventName}");

                                            ticketColumn.Item()
                                                .Text($"Cena: {eventInfo.TicketCost} RSD");

                                            ticketColumn.Item()
                                                .Text($"Lokacija: {eventInfo.LocationName}");
                                            ticketColumn.Item()
                                                .Text($"Datum: {eventInfo.StartTime.ToShortDateString()}");
                                        }

                                        ticketColumn.Item()
                                            .PaddingTop(10)
                                            .AlignCenter()
                                            .Width(250)
                                            .Image(imageBytes);
                                    });
                        });
                    });
                })
                .GeneratePdf(stream);

                return stream.ToArray();
            });
        }
    }
}
