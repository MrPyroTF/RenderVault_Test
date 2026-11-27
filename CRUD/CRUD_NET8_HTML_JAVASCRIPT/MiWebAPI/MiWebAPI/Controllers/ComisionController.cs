using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiWebAPI.Data;
using MiWebAPI.Models;

namespace MiWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComisionController : ControllerBase
    {
        private readonly ComisionData _comisionData;

        public ComisionController(ComisionData comisionData)
        {
            _comisionData = comisionData;
        }

        [HttpGet]
        public async Task<IActionResult> Lista(int id = 0)
        {
            List<Comision> lista = await _comisionData.Lista(id);
            return StatusCode(StatusCodes.Status200OK, lista);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtener(int id)
        {
            Comision objeto = await _comisionData.Obtener(id);
            return StatusCode(StatusCodes.Status200OK, objeto);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] Comision objeto)
        {
            RespuestaOperacion resultado = await _comisionData.Crear(objeto);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }

        [HttpPut]
        public async Task<IActionResult> Editar([FromBody] Comision objeto)
        {
            RespuestaOperacion resultado = await _comisionData.Editar(objeto);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            RespuestaOperacion resultado = await _comisionData.Eliminar(id);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }
    }
}