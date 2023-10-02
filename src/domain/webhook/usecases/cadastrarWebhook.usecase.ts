import { UseCase } from "src/shared/ports/usecase";
import { WebhookDto } from "../dtos/webhook.dto";
import { Webhook } from "../entities/webhook";
import { Repository } from "src/shared/ports/repository";

type InputProps = WebhookDto;
type OutputProps = Webhook;

export class CadastrarWebhookUseCase implements
UseCase<InputProps, OutputProps> {
    constructor(
        private readonly repository: Repository<Webhook>,
    ) {}

    async execute(props: InputProps): Promise<OutputProps> {
        const webhook = new Webhook(props);
        webhook.validar();
        console.log(webhook)
        return this.repository.criar({item: webhook});
    }
}