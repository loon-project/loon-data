
// export function Transactional() {
//
//     return (target, key, descriptor) => {
//         const method = descriptor.value;
//
//         const connection = DependencyRegistry.get(DBConnectionFactory);
//
//         // mock
//
//
//         descriptor.value = (...args) => {
//
//             return knex.transaction( trx => {
//                 return method.apply(target, args);
//             });
//
//         };
//     };
// }