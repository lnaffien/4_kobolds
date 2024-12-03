
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace N2I.Controllers
{
    public interface ICrudController<T>
    {
        ActionResult<IEnumerable<T>> Get();
        ActionResult<T> Get(int id);
        ActionResult<T> Post(T entity);
        ActionResult<T> Put(int id, T entity);
        ActionResult Delete(int id);
    }
}