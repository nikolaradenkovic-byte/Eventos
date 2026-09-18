using Core.Models;
using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using WebApi.DTO;
using WebApi.Mapper;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Tags("CategoryController")]
    [ApiExplorerSettings(GroupName = "Category")]
    public class CategoriesController(
        ICategoryService _categoryService,
        DtoMapperProfile mapper) : ControllerBase
    {
        [HttpGet]
        [EndpointName("GetAllCategories")]
        [EndpointSummary("Get all categories")]
        [EndpointDescription("Returns all available event categories.")]
        [SwaggerResponse(
            statusCode: 200,
            type: typeof(IEnumerable<Category>),
            description: "Categories returned successfully.")]
        [SwaggerResponse(
            statusCode: 204,
            description: "No categories found.")]
        [SwaggerResponse(
            statusCode: 400,
            description: "Bad request.")]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAllAsync()
        {
            try
            {
                IEnumerable<Category> categories =
                    await _categoryService.GetAllAsync();


                if (!categories.Any())
                {
                    return NoContent();
                }

                return Ok(categories);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("{id:guid}")]
        [EndpointName("GetCategoryById")]
        [EndpointSummary("Get category by id")]
        [EndpointDescription("Returns a category with the specified id.")]
        [SwaggerResponse(
            statusCode: 200,
            type: typeof(CategoryDto),
            description: "Category returned successfully.")]
        [SwaggerResponse(
            statusCode: 404,
            description: "Category not found.")]
        [SwaggerResponse(
            statusCode: 400,
            description: "Bad request.")]
        public async Task<ActionResult<CategoryDto>> GetByIdAsync(
            [FromRoute] Guid id)
        {
            try
            {
                Category? category =
                    await _categoryService.GetByIdAsync(id);

                if (category == null)
                {
                    return NotFound();
                }

                CategoryDto categoryDto =
                    mapper.MapToCategoryDto(category);

                return Ok(categoryDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Authorize(Roles = "organisator, admin")]
        [EndpointName("CreateCategory")]
        [EndpointSummary("Create category")]
        [EndpointDescription("Creates a new event category.")]
        [SwaggerResponse(
            statusCode: 200,
            type: typeof(CategoryDto),
            description: "Category created successfully.")]
        [SwaggerResponse(
            statusCode: 400,
            description: "Bad request.")]
        public async Task<ActionResult<CategoryDto>> Create(
            [FromBody] CategoryDto dto)
        {
            try
            {
                Category category =
                    mapper.MapToCategory(dto);

                category.Id = Guid.NewGuid();

                Category created =
                    await _categoryService.CreateAsync(category);

                CategoryDto createdDto =
                    mapper.MapToCategoryDto(created);

                return Ok(createdDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}