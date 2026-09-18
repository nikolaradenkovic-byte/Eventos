namespace Core.Models
{
    public class Response
    {
        required public string AccessToken { get; set; }
        required public string RefreshToken { get; set; }
    }
}