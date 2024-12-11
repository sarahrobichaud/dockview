export type ModuleImportInfo = {
  version: number;
  name: string;
  filename: string;
  inSrc: boolean;
};

export class DynamicImporter {
  public static loadTSX({ name, version, filename, inSrc }: ModuleImportInfo) {
    if (inSrc) {
      return () => import(`./demos/${name}/v${version}/src/${filename}.tsx`);
    }
    return () => import(`./demos/${name}/v${version}/${filename}.tsx`);
  }

  public static loadJSX({ name, version, filename, inSrc }: ModuleImportInfo) {
    if (inSrc) {
      return () => import(`./demos/${name}/v${version}/src/${filename}.jsx`);
    }
    return () => import(`./demos/${name}/v${version}/${filename}.jsx`);
  }
}
