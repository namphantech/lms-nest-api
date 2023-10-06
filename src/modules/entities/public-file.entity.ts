import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('public_file')
class PublicFile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public url: string;

  @Column()
  public key: string;
}

export default PublicFile;
