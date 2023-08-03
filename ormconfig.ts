import { DataSource } from 'typeorm';
import { config } from './src/config/account.orm.config';

export default new DataSource(config);
