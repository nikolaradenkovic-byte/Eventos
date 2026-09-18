import qrCodeImage from "../../images/icon.svg";
import eventosLogo from "../../images/eventosLogo.png";

function ControllerPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#181818] px-6 py-10">
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

      <section className="relative z-10 w-full max-w-[520px] rounded-3xl bg-white px-8 py-10 text-center shadow-2xl sm:px-14">
        <img
          src={eventosLogo}
          alt="Eventos"
          className="mx-auto mb-8 h-auto w-[150px] object-contain"
        />

        <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-orange-600">
          Kontrolor
        </span>

        <h1 className="mt-5 text-2xl font-bold text-[#181818] sm:text-3xl">
          Dobro došli!
        </h1>

        <p className="mx-auto mt-4 max-w-[390px] text-sm leading-6 text-[#777777] sm:text-base">
          Prijavljeni ste kao kontrolor događaja. Skenirajte QR kod kako biste
          preuzeli mobilnu aplikaciju za proveru i validaciju ulaznica.
        </p>

        <div className="mx-auto mt-8 flex w-fit items-center justify-center rounded-2xl border border-[#E8E8E8] bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.10)]">
          <img
            src={qrCodeImage}
            alt="QR kod za preuzimanje aplikacije"
            className="h-[210px] w-[210px] object-contain sm:h-[240px] sm:w-[240px]"
          />
        </div>

        <p className="mt-6 text-sm font-medium text-[#181818]">
          Otvorite kameru na telefonu i skenirajte kod
        </p>

        <p className="mt-2 text-xs text-[#999999]">
          Aplikacija je namenjena isključivo kontrolorima.
        </p>
      </section>
    </main>
  );
}

export default ControllerPage;
