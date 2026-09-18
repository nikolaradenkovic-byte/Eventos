using Autofac;
using WebApi.Mapper;

namespace WebApi

{
    public class MapperModule : Module

    {

        protected override void Load(ContainerBuilder builder)
        {
            base.Load(builder);
            builder.RegisterType<DtoMapperProfile>().InstancePerLifetimeScope();
        }
    }

}
