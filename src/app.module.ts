import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CalcModule } from './calc/calc.module';
import { LoggingMiddleware } from './logging/logging.middleware';

@Module({
  imports: [CalcModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
