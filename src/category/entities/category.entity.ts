import { CourseCategory } from 'src/course_category/entities/course_category.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  name: string;

  @OneToMany(() => CourseCategory, (courseCategory) => courseCategory.category)
  course_categories: CourseCategory[];
}
