using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiWebAPI.Data;
using MiWebAPI.Models;

namespace MiWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompraController : ControllerBase
    {
        private readonly CompraData _compraData;

        public CompraController(CompraData compraData)
        {
            _compraData = compraData;
        }

        [HttpGet]
        public async Task<IActionResult> Lista(int usuarioId = 0)
        {
            List<Compra> lista = await _compraData.Lista(usuarioId);
            return StatusCode(StatusCodes.Status200OK, lista);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtener(int id)
        {
            Compra objeto = await _compraData.Obtener(id);
            return StatusCode(StatusCodes.Status200OK, objeto);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] Compra objeto)
        {
            RespuestaOperacion resultado = await _compraData.Crear(objeto);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }

        [HttpPut]
        public async Task<IActionResult> Editar([FromBody] Compra objeto)
        {
            RespuestaOperacion resultado = await _compraData.Editar(objeto);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            RespuestaOperacion resultado = await _compraData.Eliminar(id);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }
    }
}