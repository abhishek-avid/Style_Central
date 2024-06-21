using Style_Central.API.Data.Models;

namespace Style_Central.API.DTO.Interface;

public interface IProductDto
{
    public Task<OperationResult<List<ProductModel>>> GetProducts();
    public Task<OperationResult> CreateProduct(ProductModel model);
    public Task<OperationResult> UpdateProduct(ProductModel model, int id);
    public Task<OperationResult> DeleteProduct(int id, int userId);
}
