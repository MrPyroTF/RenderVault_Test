using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiWebAPI.Data;
using MiWebAPI.Models;

namespace MiWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnlaceDescargaController : ControllerBase
    {
        private readonly EnlaceDescargaData _enlaceDescargaData;

        public EnlaceDescargaController(EnlaceDescargaData enlaceDescargaData)
        {
            _enlaceDescargaData = enlaceDescargaData;
        }

        [HttpGet]
        public async Task<IActionResult> Lista(int productoId = 0)
        {
            List<EnlaceDescarga> lista = await _enlaceDescargaData.Lista(productoId);
            return StatusCode(StatusCodes.Status200OK, lista);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtener(int id)
        {
            EnlaceDescarga objeto = await _enlaceDescargaData.Obtener(id);
            return StatusCode(StatusCodes.Status200OK, objeto);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] EnlaceDescarga objeto)
        {
            RespuestaOperacion resultado = await _enlaceDescargaData.Crear(objeto);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }

        [HttpPut]
        public async Task<IActionResult> Editar([FromBody] EnlaceDescarga objeto)
        {
            RespuestaOperacion resultado = await _enlaceDescargaData.Editar(objeto);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            RespuestaOperacion resultado = await _enlaceDescargaData.Eliminar(id);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }
    }
}