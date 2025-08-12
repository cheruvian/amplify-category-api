import { generateListRequestTemplate } from '../resolvers/dynamodb/query';

describe('generateListRequestTemplate - dynamic primary key handling', () => {
  it('includes dynamic pkArgName assignment with default fallback to id', () => {
    const vtl = generateListRequestTemplate();

    // Expect pkArgName to be assigned using QueryRequestVariables.partitionKey with a fallback to "id"
    expect(vtl).toContain('$pkArgName');
    expect(vtl).toContain('$ctx.stash.QueryRequestVariables.partitionKey');
    expect(vtl).toContain('$util.defaultIfNull');
    expect(vtl).toContain('"id"');
  });

  it('checks for presence of the dynamic primary key in args using contains on keySet', () => {
    const vtl = generateListRequestTemplate();

    // Expect the template to check if args contains the dynamic primary key name
    expect(vtl).toContain('args.keySet().contains($pkArgName)');
  });

  it('emits a clear validation error when sort key is provided without hash key', () => {
    const vtl = generateListRequestTemplate();

    // Error message should be model-agnostic
    expect(vtl).toContain('When providing the index sort key you must also provide the index hash key');
    expect(vtl).toContain('$util.error');
  });
});


