export namespace services {
	
	export class XMageConfig {
	    java_path: string;
	    install_path: string;
	
	    static createFrom(source: any = {}) {
	        return new XMageConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.java_path = source["java_path"];
	        this.install_path = source["install_path"];
	    }
	}
	export class MoxfieldExportConfig {
	    username: string;
	    path: string;
	
	    static createFrom(source: any = {}) {
	        return new MoxfieldExportConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.username = source["username"];
	        this.path = source["path"];
	    }
	}
	export class Config {
	    moxfield_exports: MoxfieldExportConfig[];
	    xmage: XMageConfig;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.moxfield_exports = this.convertValues(source["moxfield_exports"], MoxfieldExportConfig);
	        this.xmage = this.convertValues(source["xmage"], XMageConfig);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	

}

