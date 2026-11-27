using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiWebAPI.Data;
using MiWebAPI.Models;

namespace MiWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewData _reviewData;

        public ReviewController(ReviewData reviewData)
        {
            _reviewData = reviewData;
        }

        // Permite listar todas o filtrar por producto: /api/Review?productoId=3
        [HttpGet]
        public async Task<IActionResult> Lista([FromQuery] int productoId = 0)
        {
            List<Review> lista = await _reviewData.Lista(productoId);
            return StatusCode(StatusCodes.Status200OK, lista);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtener(int id)
        {
            Review objeto = await _reviewData.Obtener(id);
            return StatusCode(StatusCodes.Status200OK, objeto);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] Review objeto)
        {
            RespuestaOperacion resultado = await _reviewData.Crear(objeto);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }

        [HttpPut]
        public async Task<IActionResult> Editar([FromBody] Review objeto)
        {
            RespuestaOperacion resultado = await _reviewData.Editar(objeto);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            RespuestaOperacion resultado = await _reviewData.Eliminar(id);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }
    }
}