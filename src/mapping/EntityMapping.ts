import {ConverterService, DependencyRegistry} from "loon";

const converter = DependencyRegistry.get(ConverterService);


export function EntityMapping() {

    return (target, key, descriptor) => {


        const method = descriptor.value;

        descriptor.value = (...args) => {

            const params = args.map(param => {
                try {
                    return converter.convert(param, Object)
                } catch (e) {
                    return param;
                }}
            );

            return method.apply(target, params);
        };
    }
}
