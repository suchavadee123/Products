namespace products.Server.Models;

public class Product
{
    public long Id { get; set; }
    public string ProductCode { get; set; } = string.Empty;
    public string ProductCodeClean { get; set; } = string.Empty;
    public string BarcodeType { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

