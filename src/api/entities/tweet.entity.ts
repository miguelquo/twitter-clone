import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, JoinTable, ManyToOne, OneToMany} from 'typeorm'
import { User } from '../../auth/entities/user.entity'
import { Reply } from './reply.entity'

@Entity()
export class Tweet{

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, user => user.tweets, {cascade: true, eager: true})
    user: User

    @Column({length: 240})
    text: string

    @Column({type: "timestamp with time zone"})
    timestamp: string

    @ManyToMany(() => User, {cascade: true, eager:true})
    @JoinTable()
    faved_by: User[]

    @Column({type: "int", default: 0})
    favs_count: number

    @Column({default: false})
    is_reply: boolean
    
    @OneToMany(() => Reply, reply => reply.tweet)
    replies: Reply[]

    @Column({type: 'int', default: 0})
    replies_count: number
    
}