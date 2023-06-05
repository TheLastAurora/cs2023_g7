import { Request , Response} from "express";
import { Usuario } from "../entity/Usuario.js";
import { UniRentDataSource } from "../config/UniRentDataSource.js";
import { Anuncio } from "../entity/Anuncio.js";
import chalk from "chalk";
import { TipoAluguel } from "../enums/TipoAluguel.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Universidade } from "../entity/Universidade.js";
import { paginate } from "typeorm-pagination/dist/helpers/pagination.js";

export interface AnuncioDadosIniciais{
    descricao: string;

    titulo: string;

    tipoMoradia: TipoAluguel;

    tamanhoM2: string;

    endereco: string;


}

const anuncioRepository = UniRentDataSource.getRepository(Anuncio);
export class AnuncioController{

    public static async cadastrar(req: Request, res: Response){
        try{
            const usuarioDono: Usuario = await UniRentDataSource.getRepository(Usuario).findOne({
                relations: {
                    anuncios: true
                },
                where: {
                    id: Number.parseInt(req.params.id)
                }
            })

            if(usuarioDono==null) {
                res.status(500);
                throw new Error(`o id recebido nao esta associado a nenhum usuario`);
            }

            usuarioDono.anuncios.push(new Anuncio().withProperties(req.body));
            await UniRentDataSource.getRepository(Usuario).save(usuarioDono);
            res.sendStatus(200);

        }catch (err){

            res.json({ erro: `Erro no cadastro do anúncio. ${err.message }`})
        }
    }


    public static async listar(req: Request, res: Response){
        try{
            const listaDeAnuncios = await UniRentDataSource.getRepository(Anuncio).find({});
            res.json(listaDeAnuncios);

        }catch (err){
            res.json(`Erro na listagem de anuncios: ${err.message}`)
        }

    }


    public static async filtrar(req: Request, res: Response){




    }




}