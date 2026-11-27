using MiWebAPI.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirAngular", policy =>
    {
        policy.WithOrigins(
        "https://delightful-beach-088839910-preview.centralus.6.azurestaticapps.net",
        "https://delightful-beach-088839910.centralus.6.azurestaticapps.net",
        "http://localhost:4200"
    )
    .AllowAnyHeader()
    .AllowAnyMethod();
    });
});

builder.Services.AddScoped<AdministradorData>();
builder.Services.AddScoped<ProductoData>();
builder.Services.AddScoped<ReviewData>();
builder.Services.AddScoped<UsuarioData>();
builder.Services.AddScoped<ComisionData>();
builder.Services.AddScoped<CompraData>();
builder.Services.AddScoped<EnlaceDescargaData>();

var app = builder.Build();

    app.UseSwagger();
    app.UseSwaggerUI();


app.UseStaticFiles();

app.UseCors("PermitirAngular");

app.UseAuthorization();

app.MapControllers();

app.Run();