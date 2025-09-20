const request = require('supertest')
const { expect } = require('chai')
require('dotenv').config();

describe('Checkout Controller', () => {
    describe('POST /api/checkout', () => {
        let token;

        beforeEach(async () => {
            const postLogin = require('../fixture/requisicoes/login/postLogin.json');
            const respostaLogin = await request(process.env.BASE_URL_REST)
                .post('/api/users/login')
                .send(postLogin)
            token = respostaLogin.body.token;
        });

        it('Quando envio dados válidos no checkout com pagamento via cartão de crédito, recebo uma resposta 200', async () => {
            const postCheckoutSucesso = require('../fixture/requisicoes/checkout/postCheckoutSucesso.json');
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send(postCheckoutSucesso)
            const respostaEsperada = require('../fixture/respostas/checkout/quandoEnvioDadosValidosNoCheckoutReceboUmaResposta200.json');
            expect(resposta.body).to.deep.equal(respostaEsperada);
            expect(resposta.status).to.equal(200);
        });

        const testesDeErroDeNegocio = require('../fixture/requisicoes/checkout/postCheckoutWithError.json')

        testesDeErroDeNegocio.forEach(teste => {
            it(`Testando a regra relacionada a ${teste.nomeDoTeste}`, async () => {

                const resposta = await request(process.env.BASE_URL_REST)
                    .post('/api/checkout')
                    .set('Authorization', `Bearer ${token}`)
                    .send(teste.postCheckout);

                expect(resposta.status).to.equal(400);
                expect(resposta.body).to.have.property('error', teste.mensagemEsperada)
            })
        });
    });
});