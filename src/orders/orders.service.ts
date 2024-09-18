import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {

    constructor(@InjectRepository(Order) private ordersRepository: Repository<Order>) {}

    findAll() {
        return this.ordersRepository.find({ relations: ['user', 'address', 'orderHasProducts.product'] })
    }
    
    findByClient(idClient: number) {
        return this.ordersRepository.find({ 
            relations: ['user', 'address', 'orderHasProducts.product'],
            where: { id_client: idClient },
        })
    }

    async updateStatus(id: number) {
        const orderFound = await this.ordersRepository.findOneBy({id: id});
        if (!orderFound) {
            throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
        }
        const updatedOrder = Object.assign(orderFound, { status: 'ENVIADO' });
        return this.ordersRepository.save(updatedOrder);
    }

}
