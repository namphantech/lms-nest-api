export async function customizedResponse(inputObject: any, ...keys: any) {
  const customizedObject = {};

  for (const key of keys) {
    if (inputObject[key]) {
      customizedObject[key] = inputObject[key];
    }
  }
  console.log(customizedObject);

  return customizedObject;
}
