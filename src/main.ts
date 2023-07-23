import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { setup } from "./setup";
import { INestApplication } from "@nestjs/common/interfaces/nest-application.interface";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await initSwagger(app);
  setup(app);

  await app.listen(process.env.PORT || 3000);
}

async function initSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Pixaera Posts Project")
    .setDescription("The POST API description")
    .setVersion("1.0")
    .addTag("POST")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
}
bootstrap();
