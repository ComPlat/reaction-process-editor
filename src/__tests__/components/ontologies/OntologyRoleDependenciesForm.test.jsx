import {
  dependencyTypeOptionsForRole,
  ontologyOptionsForDependencyTypes,
} from '../../../components/ontologies/OntologyRoleDependenciesForm';
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

describe('ontology term dependency options', () => {
  const options = [
    { value: 'action-term', roles: { action: [{}] } },
    { value: 'class-term', roles: { class: [{}] } },
    { value: 'type-term', roles: { type: [{}] } },
    { value: 'unrelated-term', roles: { solvent: [{}] } },
  ];
  const dependencyTypeOptions = dependencyTypeOptionsForRole(
    'subtype',
    OntologyConstants.roleTypeOptions
  );

  test('includes terms matching any available dependency type before selection', () => {
    expect(ontologyOptionsForDependencyTypes({ options, dependencyTypeOptions }))
      .toEqual(options.slice(0, 3));
  });

  test('only includes terms matching the selected dependency type', () => {
    expect(ontologyOptionsForDependencyTypes({
      options,
      dependencyTypeOptions,
      selectedDependencyType: 'class',
    })).toEqual([options[1]]);
  });
});
