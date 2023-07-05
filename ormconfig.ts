import { DataSource } from 'typeorm';
import { config } from './src/config/user.orm.config';

export default new DataSource(config);
