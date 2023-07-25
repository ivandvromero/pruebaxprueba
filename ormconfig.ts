import { config } from 'src/shared/config/typeorm.config';
import { DataSource } from 'typeorm';

export default new DataSource(config);
