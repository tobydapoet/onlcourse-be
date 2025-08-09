import { TeacherRoleGuard } from './teacher_role.guard';

describe('TeacherRoleGuard', () => {
  it('should be defined', () => {
    expect(new TeacherRoleGuard()).toBeDefined();
  });
});
