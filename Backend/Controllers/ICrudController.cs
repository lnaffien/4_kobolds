
using Microsoft.AspNetCore.Mvc;

namespace N2I.Controllers
{
    public interface ICrudController<T>
    {
        Task<ActionResult<IEnumerable<T>>> Get();
        Task<ActionResult<T>> Get(int id);
        Task<ActionResult<T>> Post([FromBody] T entity);
        Task<ActionResult<T>> Put(int id, [FromBody] T entity);
        Task<ActionResult<T>> Patch(int id, [FromBody] T entity);
        Task<ActionResult> Delete(int id);
    }
}