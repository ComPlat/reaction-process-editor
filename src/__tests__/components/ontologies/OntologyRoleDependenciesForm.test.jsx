import { dependencyTypeOptionsForRole } from '../../../components/ontologies/OntologyRoleDependenciesForm';
import { OntologyConstants } from '../../../constants/OntologyConstants';

const dependencyValuesForRole = (roleName) => dependencyTypeOptionsForRole(
  roleName,
  OntologyConstants.roleTypeOptions
).map(({ value }) => value);

describe('ontology role dependency type options', () => {
  test('only includes roles above the selected Acts as role', () => {
    expect(dependencyValuesForRole('subtype')).toEqual([
      'action',
      'class',
      'type',
    ]);
  });

  test('excludes the selected role and every role below it', () => {
    const options = dependencyValuesForRole('class');

    expect(options).toEqual(['action']);
    expect(options).not.toContain('class');
    expect(options).not.toContain('type');
    expect(options).not.toContain('subtype');
  });

  test('returns no dependency types for the top or an unknown role', () => {
    expect(dependencyValuesForRole('action')).toEqual([]);
    expect(dependencyValuesForRole('unknown')).toEqual([]);
  });
});
