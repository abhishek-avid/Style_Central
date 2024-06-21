using Style_Central.API.Data.Models;

namespace Style_Central.API.Repository.Interface;
public interface IOrderService
{
    public Task<OperationResult> CreateOrder(OrderModel model);
    public Task<OperationResult<List<OrderModel>>> GetOrders(int userId);
    public Task<OperationResult<List<OrderItemModel>>> GetOrderDetail(int id);
}
