import { DefaultClass } from "src/shared/types/defaultClass";

export interface WebhookProps {
    url: string;
}

export enum WebhookMethod {
    'PagamentoCriado' = 'PagamentoCriado',
    'PagamentoAtualizado' = 'PagamentoAtualizado',
    'PagamentoDeletado' = 'PagamentoDeletado'
}

export class Webhook extends DefaultClass implements WebhookProps {
    _id?: any;
    url: string;

    constructor(props: WebhookProps) {
        super()
        Object.assign(this, props)
        this.validar();
    }

    validar() {
        if(!this.url) throw new Error("Url não informada")
        return;
    }
}