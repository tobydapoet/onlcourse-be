import { Category } from 'src/category/entities/category.entity';
import { Course } from 'src/course/entities/course.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('course_category')
export class CourseCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.course_categories, {
    eager: true,
  })
  category: Category;

  @ManyToOne(() => Course, (course) => course.course_categories, {
    eager: true,
  })
  course: Course;
}
