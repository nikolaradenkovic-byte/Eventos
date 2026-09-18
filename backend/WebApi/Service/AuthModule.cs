using Autofac;
using Service.Auth;

namespace Service

{
    public class AuthModule : Module

    {

        protected override void Load(ContainerBuilder builder)
        {
            base.Load(builder);

            builder.RegisterType<TokenProvider>().SingleInstance();

        }
    }

}
