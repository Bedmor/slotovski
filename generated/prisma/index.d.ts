
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model GameRoom
 * 
 */
export type GameRoom = $Result.DefaultSelection<Prisma.$GameRoomPayload>
/**
 * Model CrashGame
 * 
 */
export type CrashGame = $Result.DefaultSelection<Prisma.$CrashGamePayload>
/**
 * Model CrashBet
 * 
 */
export type CrashBet = $Result.DefaultSelection<Prisma.$CrashBetPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameRoom`: Exposes CRUD operations for the **GameRoom** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameRooms
    * const gameRooms = await prisma.gameRoom.findMany()
    * ```
    */
  get gameRoom(): Prisma.GameRoomDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.crashGame`: Exposes CRUD operations for the **CrashGame** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CrashGames
    * const crashGames = await prisma.crashGame.findMany()
    * ```
    */
  get crashGame(): Prisma.CrashGameDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.crashBet`: Exposes CRUD operations for the **CrashBet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CrashBets
    * const crashBets = await prisma.crashBet.findMany()
    * ```
    */
  get crashBet(): Prisma.CrashBetDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.0
   * Query Engine version: 2ba551f319ab1df4bc874a89965d8b3641056773
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    GameRoom: 'GameRoom',
    CrashGame: 'CrashGame',
    CrashBet: 'CrashBet'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "gameRoom" | "crashGame" | "crashBet"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      GameRoom: {
        payload: Prisma.$GameRoomPayload<ExtArgs>
        fields: Prisma.GameRoomFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameRoomFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoomPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameRoomFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoomPayload>
          }
          findFirst: {
            args: Prisma.GameRoomFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoomPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameRoomFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoomPayload>
          }
          findMany: {
            args: Prisma.GameRoomFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoomPayload>[]
          }
          create: {
            args: Prisma.GameRoomCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoomPayload>
          }
          createMany: {
            args: Prisma.GameRoomCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameRoomCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoomPayload>[]
          }
          delete: {
            args: Prisma.GameRoomDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoomPayload>
          }
          update: {
            args: Prisma.GameRoomUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoomPayload>
          }
          deleteMany: {
            args: Prisma.GameRoomDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameRoomUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameRoomUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoomPayload>[]
          }
          upsert: {
            args: Prisma.GameRoomUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoomPayload>
          }
          aggregate: {
            args: Prisma.GameRoomAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameRoom>
          }
          groupBy: {
            args: Prisma.GameRoomGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameRoomGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameRoomCountArgs<ExtArgs>
            result: $Utils.Optional<GameRoomCountAggregateOutputType> | number
          }
        }
      }
      CrashGame: {
        payload: Prisma.$CrashGamePayload<ExtArgs>
        fields: Prisma.CrashGameFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CrashGameFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashGamePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CrashGameFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashGamePayload>
          }
          findFirst: {
            args: Prisma.CrashGameFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashGamePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CrashGameFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashGamePayload>
          }
          findMany: {
            args: Prisma.CrashGameFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashGamePayload>[]
          }
          create: {
            args: Prisma.CrashGameCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashGamePayload>
          }
          createMany: {
            args: Prisma.CrashGameCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CrashGameCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashGamePayload>[]
          }
          delete: {
            args: Prisma.CrashGameDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashGamePayload>
          }
          update: {
            args: Prisma.CrashGameUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashGamePayload>
          }
          deleteMany: {
            args: Prisma.CrashGameDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CrashGameUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CrashGameUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashGamePayload>[]
          }
          upsert: {
            args: Prisma.CrashGameUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashGamePayload>
          }
          aggregate: {
            args: Prisma.CrashGameAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCrashGame>
          }
          groupBy: {
            args: Prisma.CrashGameGroupByArgs<ExtArgs>
            result: $Utils.Optional<CrashGameGroupByOutputType>[]
          }
          count: {
            args: Prisma.CrashGameCountArgs<ExtArgs>
            result: $Utils.Optional<CrashGameCountAggregateOutputType> | number
          }
        }
      }
      CrashBet: {
        payload: Prisma.$CrashBetPayload<ExtArgs>
        fields: Prisma.CrashBetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CrashBetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashBetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CrashBetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashBetPayload>
          }
          findFirst: {
            args: Prisma.CrashBetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashBetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CrashBetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashBetPayload>
          }
          findMany: {
            args: Prisma.CrashBetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashBetPayload>[]
          }
          create: {
            args: Prisma.CrashBetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashBetPayload>
          }
          createMany: {
            args: Prisma.CrashBetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CrashBetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashBetPayload>[]
          }
          delete: {
            args: Prisma.CrashBetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashBetPayload>
          }
          update: {
            args: Prisma.CrashBetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashBetPayload>
          }
          deleteMany: {
            args: Prisma.CrashBetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CrashBetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CrashBetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashBetPayload>[]
          }
          upsert: {
            args: Prisma.CrashBetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrashBetPayload>
          }
          aggregate: {
            args: Prisma.CrashBetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCrashBet>
          }
          groupBy: {
            args: Prisma.CrashBetGroupByArgs<ExtArgs>
            result: $Utils.Optional<CrashBetGroupByOutputType>[]
          }
          count: {
            args: Prisma.CrashBetCountArgs<ExtArgs>
            result: $Utils.Optional<CrashBetCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    gameRoom?: GameRoomOmit
    crashGame?: CrashGameOmit
    crashBet?: CrashBetOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    crashBets: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    crashBets?: boolean | UserCountOutputTypeCountCrashBetsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCrashBetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CrashBetWhereInput
  }


  /**
   * Count Type CrashGameCountOutputType
   */

  export type CrashGameCountOutputType = {
    bets: number
  }

  export type CrashGameCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bets?: boolean | CrashGameCountOutputTypeCountBetsArgs
  }

  // Custom InputTypes
  /**
   * CrashGameCountOutputType without action
   */
  export type CrashGameCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashGameCountOutputType
     */
    select?: CrashGameCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CrashGameCountOutputType without action
   */
  export type CrashGameCountOutputTypeCountBetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CrashBetWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    credits: number | null
  }

  export type UserSumAggregateOutputType = {
    credits: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    password: string | null
    credits: number | null
    lastDailyReward: Date | null
    role: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    password: string | null
    credits: number | null
    lastDailyReward: Date | null
    role: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    image: number
    password: number
    credits: number
    lastDailyReward: number
    role: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    credits?: true
  }

  export type UserSumAggregateInputType = {
    credits?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    password?: true
    credits?: true
    lastDailyReward?: true
    role?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    password?: true
    credits?: true
    lastDailyReward?: true
    role?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    password?: true
    credits?: true
    lastDailyReward?: true
    role?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    password: string | null
    credits: number
    lastDailyReward: Date | null
    role: string
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    password?: boolean
    credits?: boolean
    lastDailyReward?: boolean
    role?: boolean
    crashBets?: boolean | User$crashBetsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    password?: boolean
    credits?: boolean
    lastDailyReward?: boolean
    role?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    password?: boolean
    credits?: boolean
    lastDailyReward?: boolean
    role?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    password?: boolean
    credits?: boolean
    lastDailyReward?: boolean
    role?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "image" | "password" | "credits" | "lastDailyReward" | "role", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    crashBets?: boolean | User$crashBetsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      crashBets: Prisma.$CrashBetPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string | null
      emailVerified: Date | null
      image: string | null
      password: string | null
      credits: number
      lastDailyReward: Date | null
      role: string
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    crashBets<T extends User$crashBetsArgs<ExtArgs> = {}>(args?: Subset<T, User$crashBetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrashBetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
    readonly image: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly credits: FieldRef<"User", 'Int'>
    readonly lastDailyReward: FieldRef<"User", 'DateTime'>
    readonly role: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data?: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.crashBets
   */
  export type User$crashBetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashBet
     */
    select?: CrashBetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashBet
     */
    omit?: CrashBetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashBetInclude<ExtArgs> | null
    where?: CrashBetWhereInput
    orderBy?: CrashBetOrderByWithRelationInput | CrashBetOrderByWithRelationInput[]
    cursor?: CrashBetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CrashBetScalarFieldEnum | CrashBetScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model GameRoom
   */

  export type AggregateGameRoom = {
    _count: GameRoomCountAggregateOutputType | null
    _avg: GameRoomAvgAggregateOutputType | null
    _sum: GameRoomSumAggregateOutputType | null
    _min: GameRoomMinAggregateOutputType | null
    _max: GameRoomMaxAggregateOutputType | null
  }

  export type GameRoomAvgAggregateOutputType = {
    currentPlayerIndex: number | null
    maxPlayers: number | null
  }

  export type GameRoomSumAggregateOutputType = {
    currentPlayerIndex: number | null
    maxPlayers: number | null
  }

  export type GameRoomMinAggregateOutputType = {
    id: string | null
    currentPlayerIndex: number | null
    gameStarted: boolean | null
    gameEnded: boolean | null
    createdAt: Date | null
    maxPlayers: number | null
  }

  export type GameRoomMaxAggregateOutputType = {
    id: string | null
    currentPlayerIndex: number | null
    gameStarted: boolean | null
    gameEnded: boolean | null
    createdAt: Date | null
    maxPlayers: number | null
  }

  export type GameRoomCountAggregateOutputType = {
    id: number
    players: number
    dealer: number
    deck: number
    currentPlayerIndex: number
    gameStarted: number
    gameEnded: number
    createdAt: number
    maxPlayers: number
    _all: number
  }


  export type GameRoomAvgAggregateInputType = {
    currentPlayerIndex?: true
    maxPlayers?: true
  }

  export type GameRoomSumAggregateInputType = {
    currentPlayerIndex?: true
    maxPlayers?: true
  }

  export type GameRoomMinAggregateInputType = {
    id?: true
    currentPlayerIndex?: true
    gameStarted?: true
    gameEnded?: true
    createdAt?: true
    maxPlayers?: true
  }

  export type GameRoomMaxAggregateInputType = {
    id?: true
    currentPlayerIndex?: true
    gameStarted?: true
    gameEnded?: true
    createdAt?: true
    maxPlayers?: true
  }

  export type GameRoomCountAggregateInputType = {
    id?: true
    players?: true
    dealer?: true
    deck?: true
    currentPlayerIndex?: true
    gameStarted?: true
    gameEnded?: true
    createdAt?: true
    maxPlayers?: true
    _all?: true
  }

  export type GameRoomAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameRoom to aggregate.
     */
    where?: GameRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameRooms to fetch.
     */
    orderBy?: GameRoomOrderByWithRelationInput | GameRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameRooms
    **/
    _count?: true | GameRoomCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameRoomAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameRoomSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameRoomMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameRoomMaxAggregateInputType
  }

  export type GetGameRoomAggregateType<T extends GameRoomAggregateArgs> = {
        [P in keyof T & keyof AggregateGameRoom]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameRoom[P]>
      : GetScalarType<T[P], AggregateGameRoom[P]>
  }




  export type GameRoomGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameRoomWhereInput
    orderBy?: GameRoomOrderByWithAggregationInput | GameRoomOrderByWithAggregationInput[]
    by: GameRoomScalarFieldEnum[] | GameRoomScalarFieldEnum
    having?: GameRoomScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameRoomCountAggregateInputType | true
    _avg?: GameRoomAvgAggregateInputType
    _sum?: GameRoomSumAggregateInputType
    _min?: GameRoomMinAggregateInputType
    _max?: GameRoomMaxAggregateInputType
  }

  export type GameRoomGroupByOutputType = {
    id: string
    players: JsonValue
    dealer: JsonValue
    deck: JsonValue
    currentPlayerIndex: number
    gameStarted: boolean
    gameEnded: boolean
    createdAt: Date
    maxPlayers: number
    _count: GameRoomCountAggregateOutputType | null
    _avg: GameRoomAvgAggregateOutputType | null
    _sum: GameRoomSumAggregateOutputType | null
    _min: GameRoomMinAggregateOutputType | null
    _max: GameRoomMaxAggregateOutputType | null
  }

  type GetGameRoomGroupByPayload<T extends GameRoomGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameRoomGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameRoomGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameRoomGroupByOutputType[P]>
            : GetScalarType<T[P], GameRoomGroupByOutputType[P]>
        }
      >
    >


  export type GameRoomSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    players?: boolean
    dealer?: boolean
    deck?: boolean
    currentPlayerIndex?: boolean
    gameStarted?: boolean
    gameEnded?: boolean
    createdAt?: boolean
    maxPlayers?: boolean
  }, ExtArgs["result"]["gameRoom"]>

  export type GameRoomSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    players?: boolean
    dealer?: boolean
    deck?: boolean
    currentPlayerIndex?: boolean
    gameStarted?: boolean
    gameEnded?: boolean
    createdAt?: boolean
    maxPlayers?: boolean
  }, ExtArgs["result"]["gameRoom"]>

  export type GameRoomSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    players?: boolean
    dealer?: boolean
    deck?: boolean
    currentPlayerIndex?: boolean
    gameStarted?: boolean
    gameEnded?: boolean
    createdAt?: boolean
    maxPlayers?: boolean
  }, ExtArgs["result"]["gameRoom"]>

  export type GameRoomSelectScalar = {
    id?: boolean
    players?: boolean
    dealer?: boolean
    deck?: boolean
    currentPlayerIndex?: boolean
    gameStarted?: boolean
    gameEnded?: boolean
    createdAt?: boolean
    maxPlayers?: boolean
  }

  export type GameRoomOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "players" | "dealer" | "deck" | "currentPlayerIndex" | "gameStarted" | "gameEnded" | "createdAt" | "maxPlayers", ExtArgs["result"]["gameRoom"]>

  export type $GameRoomPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameRoom"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      players: Prisma.JsonValue
      dealer: Prisma.JsonValue
      deck: Prisma.JsonValue
      currentPlayerIndex: number
      gameStarted: boolean
      gameEnded: boolean
      createdAt: Date
      maxPlayers: number
    }, ExtArgs["result"]["gameRoom"]>
    composites: {}
  }

  type GameRoomGetPayload<S extends boolean | null | undefined | GameRoomDefaultArgs> = $Result.GetResult<Prisma.$GameRoomPayload, S>

  type GameRoomCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameRoomFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameRoomCountAggregateInputType | true
    }

  export interface GameRoomDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameRoom'], meta: { name: 'GameRoom' } }
    /**
     * Find zero or one GameRoom that matches the filter.
     * @param {GameRoomFindUniqueArgs} args - Arguments to find a GameRoom
     * @example
     * // Get one GameRoom
     * const gameRoom = await prisma.gameRoom.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameRoomFindUniqueArgs>(args: SelectSubset<T, GameRoomFindUniqueArgs<ExtArgs>>): Prisma__GameRoomClient<$Result.GetResult<Prisma.$GameRoomPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameRoom that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameRoomFindUniqueOrThrowArgs} args - Arguments to find a GameRoom
     * @example
     * // Get one GameRoom
     * const gameRoom = await prisma.gameRoom.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameRoomFindUniqueOrThrowArgs>(args: SelectSubset<T, GameRoomFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameRoomClient<$Result.GetResult<Prisma.$GameRoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameRoom that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoomFindFirstArgs} args - Arguments to find a GameRoom
     * @example
     * // Get one GameRoom
     * const gameRoom = await prisma.gameRoom.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameRoomFindFirstArgs>(args?: SelectSubset<T, GameRoomFindFirstArgs<ExtArgs>>): Prisma__GameRoomClient<$Result.GetResult<Prisma.$GameRoomPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameRoom that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoomFindFirstOrThrowArgs} args - Arguments to find a GameRoom
     * @example
     * // Get one GameRoom
     * const gameRoom = await prisma.gameRoom.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameRoomFindFirstOrThrowArgs>(args?: SelectSubset<T, GameRoomFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameRoomClient<$Result.GetResult<Prisma.$GameRoomPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameRooms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoomFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameRooms
     * const gameRooms = await prisma.gameRoom.findMany()
     * 
     * // Get first 10 GameRooms
     * const gameRooms = await prisma.gameRoom.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameRoomWithIdOnly = await prisma.gameRoom.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameRoomFindManyArgs>(args?: SelectSubset<T, GameRoomFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameRoomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameRoom.
     * @param {GameRoomCreateArgs} args - Arguments to create a GameRoom.
     * @example
     * // Create one GameRoom
     * const GameRoom = await prisma.gameRoom.create({
     *   data: {
     *     // ... data to create a GameRoom
     *   }
     * })
     * 
     */
    create<T extends GameRoomCreateArgs>(args: SelectSubset<T, GameRoomCreateArgs<ExtArgs>>): Prisma__GameRoomClient<$Result.GetResult<Prisma.$GameRoomPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameRooms.
     * @param {GameRoomCreateManyArgs} args - Arguments to create many GameRooms.
     * @example
     * // Create many GameRooms
     * const gameRoom = await prisma.gameRoom.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameRoomCreateManyArgs>(args?: SelectSubset<T, GameRoomCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GameRooms and returns the data saved in the database.
     * @param {GameRoomCreateManyAndReturnArgs} args - Arguments to create many GameRooms.
     * @example
     * // Create many GameRooms
     * const gameRoom = await prisma.gameRoom.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GameRooms and only return the `id`
     * const gameRoomWithIdOnly = await prisma.gameRoom.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameRoomCreateManyAndReturnArgs>(args?: SelectSubset<T, GameRoomCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameRoomPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GameRoom.
     * @param {GameRoomDeleteArgs} args - Arguments to delete one GameRoom.
     * @example
     * // Delete one GameRoom
     * const GameRoom = await prisma.gameRoom.delete({
     *   where: {
     *     // ... filter to delete one GameRoom
     *   }
     * })
     * 
     */
    delete<T extends GameRoomDeleteArgs>(args: SelectSubset<T, GameRoomDeleteArgs<ExtArgs>>): Prisma__GameRoomClient<$Result.GetResult<Prisma.$GameRoomPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameRoom.
     * @param {GameRoomUpdateArgs} args - Arguments to update one GameRoom.
     * @example
     * // Update one GameRoom
     * const gameRoom = await prisma.gameRoom.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameRoomUpdateArgs>(args: SelectSubset<T, GameRoomUpdateArgs<ExtArgs>>): Prisma__GameRoomClient<$Result.GetResult<Prisma.$GameRoomPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameRooms.
     * @param {GameRoomDeleteManyArgs} args - Arguments to filter GameRooms to delete.
     * @example
     * // Delete a few GameRooms
     * const { count } = await prisma.gameRoom.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameRoomDeleteManyArgs>(args?: SelectSubset<T, GameRoomDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameRooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoomUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameRooms
     * const gameRoom = await prisma.gameRoom.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameRoomUpdateManyArgs>(args: SelectSubset<T, GameRoomUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameRooms and returns the data updated in the database.
     * @param {GameRoomUpdateManyAndReturnArgs} args - Arguments to update many GameRooms.
     * @example
     * // Update many GameRooms
     * const gameRoom = await prisma.gameRoom.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GameRooms and only return the `id`
     * const gameRoomWithIdOnly = await prisma.gameRoom.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameRoomUpdateManyAndReturnArgs>(args: SelectSubset<T, GameRoomUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameRoomPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GameRoom.
     * @param {GameRoomUpsertArgs} args - Arguments to update or create a GameRoom.
     * @example
     * // Update or create a GameRoom
     * const gameRoom = await prisma.gameRoom.upsert({
     *   create: {
     *     // ... data to create a GameRoom
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameRoom we want to update
     *   }
     * })
     */
    upsert<T extends GameRoomUpsertArgs>(args: SelectSubset<T, GameRoomUpsertArgs<ExtArgs>>): Prisma__GameRoomClient<$Result.GetResult<Prisma.$GameRoomPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameRooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoomCountArgs} args - Arguments to filter GameRooms to count.
     * @example
     * // Count the number of GameRooms
     * const count = await prisma.gameRoom.count({
     *   where: {
     *     // ... the filter for the GameRooms we want to count
     *   }
     * })
    **/
    count<T extends GameRoomCountArgs>(
      args?: Subset<T, GameRoomCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameRoomCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameRoom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoomAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameRoomAggregateArgs>(args: Subset<T, GameRoomAggregateArgs>): Prisma.PrismaPromise<GetGameRoomAggregateType<T>>

    /**
     * Group by GameRoom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoomGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameRoomGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameRoomGroupByArgs['orderBy'] }
        : { orderBy?: GameRoomGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameRoomGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameRoomGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameRoom model
   */
  readonly fields: GameRoomFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameRoom.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameRoomClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameRoom model
   */
  interface GameRoomFieldRefs {
    readonly id: FieldRef<"GameRoom", 'String'>
    readonly players: FieldRef<"GameRoom", 'Json'>
    readonly dealer: FieldRef<"GameRoom", 'Json'>
    readonly deck: FieldRef<"GameRoom", 'Json'>
    readonly currentPlayerIndex: FieldRef<"GameRoom", 'Int'>
    readonly gameStarted: FieldRef<"GameRoom", 'Boolean'>
    readonly gameEnded: FieldRef<"GameRoom", 'Boolean'>
    readonly createdAt: FieldRef<"GameRoom", 'DateTime'>
    readonly maxPlayers: FieldRef<"GameRoom", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * GameRoom findUnique
   */
  export type GameRoomFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoom
     */
    select?: GameRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoom
     */
    omit?: GameRoomOmit<ExtArgs> | null
    /**
     * Filter, which GameRoom to fetch.
     */
    where: GameRoomWhereUniqueInput
  }

  /**
   * GameRoom findUniqueOrThrow
   */
  export type GameRoomFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoom
     */
    select?: GameRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoom
     */
    omit?: GameRoomOmit<ExtArgs> | null
    /**
     * Filter, which GameRoom to fetch.
     */
    where: GameRoomWhereUniqueInput
  }

  /**
   * GameRoom findFirst
   */
  export type GameRoomFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoom
     */
    select?: GameRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoom
     */
    omit?: GameRoomOmit<ExtArgs> | null
    /**
     * Filter, which GameRoom to fetch.
     */
    where?: GameRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameRooms to fetch.
     */
    orderBy?: GameRoomOrderByWithRelationInput | GameRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameRooms.
     */
    cursor?: GameRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameRooms.
     */
    distinct?: GameRoomScalarFieldEnum | GameRoomScalarFieldEnum[]
  }

  /**
   * GameRoom findFirstOrThrow
   */
  export type GameRoomFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoom
     */
    select?: GameRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoom
     */
    omit?: GameRoomOmit<ExtArgs> | null
    /**
     * Filter, which GameRoom to fetch.
     */
    where?: GameRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameRooms to fetch.
     */
    orderBy?: GameRoomOrderByWithRelationInput | GameRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameRooms.
     */
    cursor?: GameRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameRooms.
     */
    distinct?: GameRoomScalarFieldEnum | GameRoomScalarFieldEnum[]
  }

  /**
   * GameRoom findMany
   */
  export type GameRoomFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoom
     */
    select?: GameRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoom
     */
    omit?: GameRoomOmit<ExtArgs> | null
    /**
     * Filter, which GameRooms to fetch.
     */
    where?: GameRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameRooms to fetch.
     */
    orderBy?: GameRoomOrderByWithRelationInput | GameRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameRooms.
     */
    cursor?: GameRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameRooms.
     */
    skip?: number
    distinct?: GameRoomScalarFieldEnum | GameRoomScalarFieldEnum[]
  }

  /**
   * GameRoom create
   */
  export type GameRoomCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoom
     */
    select?: GameRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoom
     */
    omit?: GameRoomOmit<ExtArgs> | null
    /**
     * The data needed to create a GameRoom.
     */
    data: XOR<GameRoomCreateInput, GameRoomUncheckedCreateInput>
  }

  /**
   * GameRoom createMany
   */
  export type GameRoomCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameRooms.
     */
    data: GameRoomCreateManyInput | GameRoomCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameRoom createManyAndReturn
   */
  export type GameRoomCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoom
     */
    select?: GameRoomSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoom
     */
    omit?: GameRoomOmit<ExtArgs> | null
    /**
     * The data used to create many GameRooms.
     */
    data: GameRoomCreateManyInput | GameRoomCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameRoom update
   */
  export type GameRoomUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoom
     */
    select?: GameRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoom
     */
    omit?: GameRoomOmit<ExtArgs> | null
    /**
     * The data needed to update a GameRoom.
     */
    data: XOR<GameRoomUpdateInput, GameRoomUncheckedUpdateInput>
    /**
     * Choose, which GameRoom to update.
     */
    where: GameRoomWhereUniqueInput
  }

  /**
   * GameRoom updateMany
   */
  export type GameRoomUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameRooms.
     */
    data: XOR<GameRoomUpdateManyMutationInput, GameRoomUncheckedUpdateManyInput>
    /**
     * Filter which GameRooms to update
     */
    where?: GameRoomWhereInput
    /**
     * Limit how many GameRooms to update.
     */
    limit?: number
  }

  /**
   * GameRoom updateManyAndReturn
   */
  export type GameRoomUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoom
     */
    select?: GameRoomSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoom
     */
    omit?: GameRoomOmit<ExtArgs> | null
    /**
     * The data used to update GameRooms.
     */
    data: XOR<GameRoomUpdateManyMutationInput, GameRoomUncheckedUpdateManyInput>
    /**
     * Filter which GameRooms to update
     */
    where?: GameRoomWhereInput
    /**
     * Limit how many GameRooms to update.
     */
    limit?: number
  }

  /**
   * GameRoom upsert
   */
  export type GameRoomUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoom
     */
    select?: GameRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoom
     */
    omit?: GameRoomOmit<ExtArgs> | null
    /**
     * The filter to search for the GameRoom to update in case it exists.
     */
    where: GameRoomWhereUniqueInput
    /**
     * In case the GameRoom found by the `where` argument doesn't exist, create a new GameRoom with this data.
     */
    create: XOR<GameRoomCreateInput, GameRoomUncheckedCreateInput>
    /**
     * In case the GameRoom was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameRoomUpdateInput, GameRoomUncheckedUpdateInput>
  }

  /**
   * GameRoom delete
   */
  export type GameRoomDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoom
     */
    select?: GameRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoom
     */
    omit?: GameRoomOmit<ExtArgs> | null
    /**
     * Filter which GameRoom to delete.
     */
    where: GameRoomWhereUniqueInput
  }

  /**
   * GameRoom deleteMany
   */
  export type GameRoomDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameRooms to delete
     */
    where?: GameRoomWhereInput
    /**
     * Limit how many GameRooms to delete.
     */
    limit?: number
  }

  /**
   * GameRoom without action
   */
  export type GameRoomDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoom
     */
    select?: GameRoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRoom
     */
    omit?: GameRoomOmit<ExtArgs> | null
  }


  /**
   * Model CrashGame
   */

  export type AggregateCrashGame = {
    _count: CrashGameCountAggregateOutputType | null
    _avg: CrashGameAvgAggregateOutputType | null
    _sum: CrashGameSumAggregateOutputType | null
    _min: CrashGameMinAggregateOutputType | null
    _max: CrashGameMaxAggregateOutputType | null
  }

  export type CrashGameAvgAggregateOutputType = {
    crashPoint: number | null
  }

  export type CrashGameSumAggregateOutputType = {
    crashPoint: number | null
  }

  export type CrashGameMinAggregateOutputType = {
    id: string | null
    crashPoint: number | null
    startTime: Date | null
    status: string | null
  }

  export type CrashGameMaxAggregateOutputType = {
    id: string | null
    crashPoint: number | null
    startTime: Date | null
    status: string | null
  }

  export type CrashGameCountAggregateOutputType = {
    id: number
    crashPoint: number
    startTime: number
    status: number
    _all: number
  }


  export type CrashGameAvgAggregateInputType = {
    crashPoint?: true
  }

  export type CrashGameSumAggregateInputType = {
    crashPoint?: true
  }

  export type CrashGameMinAggregateInputType = {
    id?: true
    crashPoint?: true
    startTime?: true
    status?: true
  }

  export type CrashGameMaxAggregateInputType = {
    id?: true
    crashPoint?: true
    startTime?: true
    status?: true
  }

  export type CrashGameCountAggregateInputType = {
    id?: true
    crashPoint?: true
    startTime?: true
    status?: true
    _all?: true
  }

  export type CrashGameAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CrashGame to aggregate.
     */
    where?: CrashGameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrashGames to fetch.
     */
    orderBy?: CrashGameOrderByWithRelationInput | CrashGameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CrashGameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrashGames from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrashGames.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CrashGames
    **/
    _count?: true | CrashGameCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CrashGameAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CrashGameSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CrashGameMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CrashGameMaxAggregateInputType
  }

  export type GetCrashGameAggregateType<T extends CrashGameAggregateArgs> = {
        [P in keyof T & keyof AggregateCrashGame]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCrashGame[P]>
      : GetScalarType<T[P], AggregateCrashGame[P]>
  }




  export type CrashGameGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CrashGameWhereInput
    orderBy?: CrashGameOrderByWithAggregationInput | CrashGameOrderByWithAggregationInput[]
    by: CrashGameScalarFieldEnum[] | CrashGameScalarFieldEnum
    having?: CrashGameScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CrashGameCountAggregateInputType | true
    _avg?: CrashGameAvgAggregateInputType
    _sum?: CrashGameSumAggregateInputType
    _min?: CrashGameMinAggregateInputType
    _max?: CrashGameMaxAggregateInputType
  }

  export type CrashGameGroupByOutputType = {
    id: string
    crashPoint: number
    startTime: Date
    status: string
    _count: CrashGameCountAggregateOutputType | null
    _avg: CrashGameAvgAggregateOutputType | null
    _sum: CrashGameSumAggregateOutputType | null
    _min: CrashGameMinAggregateOutputType | null
    _max: CrashGameMaxAggregateOutputType | null
  }

  type GetCrashGameGroupByPayload<T extends CrashGameGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CrashGameGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CrashGameGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CrashGameGroupByOutputType[P]>
            : GetScalarType<T[P], CrashGameGroupByOutputType[P]>
        }
      >
    >


  export type CrashGameSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    crashPoint?: boolean
    startTime?: boolean
    status?: boolean
    bets?: boolean | CrashGame$betsArgs<ExtArgs>
    _count?: boolean | CrashGameCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["crashGame"]>

  export type CrashGameSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    crashPoint?: boolean
    startTime?: boolean
    status?: boolean
  }, ExtArgs["result"]["crashGame"]>

  export type CrashGameSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    crashPoint?: boolean
    startTime?: boolean
    status?: boolean
  }, ExtArgs["result"]["crashGame"]>

  export type CrashGameSelectScalar = {
    id?: boolean
    crashPoint?: boolean
    startTime?: boolean
    status?: boolean
  }

  export type CrashGameOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "crashPoint" | "startTime" | "status", ExtArgs["result"]["crashGame"]>
  export type CrashGameInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bets?: boolean | CrashGame$betsArgs<ExtArgs>
    _count?: boolean | CrashGameCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CrashGameIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CrashGameIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CrashGamePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CrashGame"
    objects: {
      bets: Prisma.$CrashBetPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      crashPoint: number
      startTime: Date
      status: string
    }, ExtArgs["result"]["crashGame"]>
    composites: {}
  }

  type CrashGameGetPayload<S extends boolean | null | undefined | CrashGameDefaultArgs> = $Result.GetResult<Prisma.$CrashGamePayload, S>

  type CrashGameCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CrashGameFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CrashGameCountAggregateInputType | true
    }

  export interface CrashGameDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CrashGame'], meta: { name: 'CrashGame' } }
    /**
     * Find zero or one CrashGame that matches the filter.
     * @param {CrashGameFindUniqueArgs} args - Arguments to find a CrashGame
     * @example
     * // Get one CrashGame
     * const crashGame = await prisma.crashGame.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CrashGameFindUniqueArgs>(args: SelectSubset<T, CrashGameFindUniqueArgs<ExtArgs>>): Prisma__CrashGameClient<$Result.GetResult<Prisma.$CrashGamePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CrashGame that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CrashGameFindUniqueOrThrowArgs} args - Arguments to find a CrashGame
     * @example
     * // Get one CrashGame
     * const crashGame = await prisma.crashGame.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CrashGameFindUniqueOrThrowArgs>(args: SelectSubset<T, CrashGameFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CrashGameClient<$Result.GetResult<Prisma.$CrashGamePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CrashGame that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashGameFindFirstArgs} args - Arguments to find a CrashGame
     * @example
     * // Get one CrashGame
     * const crashGame = await prisma.crashGame.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CrashGameFindFirstArgs>(args?: SelectSubset<T, CrashGameFindFirstArgs<ExtArgs>>): Prisma__CrashGameClient<$Result.GetResult<Prisma.$CrashGamePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CrashGame that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashGameFindFirstOrThrowArgs} args - Arguments to find a CrashGame
     * @example
     * // Get one CrashGame
     * const crashGame = await prisma.crashGame.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CrashGameFindFirstOrThrowArgs>(args?: SelectSubset<T, CrashGameFindFirstOrThrowArgs<ExtArgs>>): Prisma__CrashGameClient<$Result.GetResult<Prisma.$CrashGamePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CrashGames that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashGameFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CrashGames
     * const crashGames = await prisma.crashGame.findMany()
     * 
     * // Get first 10 CrashGames
     * const crashGames = await prisma.crashGame.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const crashGameWithIdOnly = await prisma.crashGame.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CrashGameFindManyArgs>(args?: SelectSubset<T, CrashGameFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrashGamePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CrashGame.
     * @param {CrashGameCreateArgs} args - Arguments to create a CrashGame.
     * @example
     * // Create one CrashGame
     * const CrashGame = await prisma.crashGame.create({
     *   data: {
     *     // ... data to create a CrashGame
     *   }
     * })
     * 
     */
    create<T extends CrashGameCreateArgs>(args: SelectSubset<T, CrashGameCreateArgs<ExtArgs>>): Prisma__CrashGameClient<$Result.GetResult<Prisma.$CrashGamePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CrashGames.
     * @param {CrashGameCreateManyArgs} args - Arguments to create many CrashGames.
     * @example
     * // Create many CrashGames
     * const crashGame = await prisma.crashGame.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CrashGameCreateManyArgs>(args?: SelectSubset<T, CrashGameCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CrashGames and returns the data saved in the database.
     * @param {CrashGameCreateManyAndReturnArgs} args - Arguments to create many CrashGames.
     * @example
     * // Create many CrashGames
     * const crashGame = await prisma.crashGame.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CrashGames and only return the `id`
     * const crashGameWithIdOnly = await prisma.crashGame.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CrashGameCreateManyAndReturnArgs>(args?: SelectSubset<T, CrashGameCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrashGamePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CrashGame.
     * @param {CrashGameDeleteArgs} args - Arguments to delete one CrashGame.
     * @example
     * // Delete one CrashGame
     * const CrashGame = await prisma.crashGame.delete({
     *   where: {
     *     // ... filter to delete one CrashGame
     *   }
     * })
     * 
     */
    delete<T extends CrashGameDeleteArgs>(args: SelectSubset<T, CrashGameDeleteArgs<ExtArgs>>): Prisma__CrashGameClient<$Result.GetResult<Prisma.$CrashGamePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CrashGame.
     * @param {CrashGameUpdateArgs} args - Arguments to update one CrashGame.
     * @example
     * // Update one CrashGame
     * const crashGame = await prisma.crashGame.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CrashGameUpdateArgs>(args: SelectSubset<T, CrashGameUpdateArgs<ExtArgs>>): Prisma__CrashGameClient<$Result.GetResult<Prisma.$CrashGamePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CrashGames.
     * @param {CrashGameDeleteManyArgs} args - Arguments to filter CrashGames to delete.
     * @example
     * // Delete a few CrashGames
     * const { count } = await prisma.crashGame.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CrashGameDeleteManyArgs>(args?: SelectSubset<T, CrashGameDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CrashGames.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashGameUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CrashGames
     * const crashGame = await prisma.crashGame.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CrashGameUpdateManyArgs>(args: SelectSubset<T, CrashGameUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CrashGames and returns the data updated in the database.
     * @param {CrashGameUpdateManyAndReturnArgs} args - Arguments to update many CrashGames.
     * @example
     * // Update many CrashGames
     * const crashGame = await prisma.crashGame.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CrashGames and only return the `id`
     * const crashGameWithIdOnly = await prisma.crashGame.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CrashGameUpdateManyAndReturnArgs>(args: SelectSubset<T, CrashGameUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrashGamePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CrashGame.
     * @param {CrashGameUpsertArgs} args - Arguments to update or create a CrashGame.
     * @example
     * // Update or create a CrashGame
     * const crashGame = await prisma.crashGame.upsert({
     *   create: {
     *     // ... data to create a CrashGame
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CrashGame we want to update
     *   }
     * })
     */
    upsert<T extends CrashGameUpsertArgs>(args: SelectSubset<T, CrashGameUpsertArgs<ExtArgs>>): Prisma__CrashGameClient<$Result.GetResult<Prisma.$CrashGamePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CrashGames.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashGameCountArgs} args - Arguments to filter CrashGames to count.
     * @example
     * // Count the number of CrashGames
     * const count = await prisma.crashGame.count({
     *   where: {
     *     // ... the filter for the CrashGames we want to count
     *   }
     * })
    **/
    count<T extends CrashGameCountArgs>(
      args?: Subset<T, CrashGameCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CrashGameCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CrashGame.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashGameAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CrashGameAggregateArgs>(args: Subset<T, CrashGameAggregateArgs>): Prisma.PrismaPromise<GetCrashGameAggregateType<T>>

    /**
     * Group by CrashGame.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashGameGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CrashGameGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CrashGameGroupByArgs['orderBy'] }
        : { orderBy?: CrashGameGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CrashGameGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCrashGameGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CrashGame model
   */
  readonly fields: CrashGameFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CrashGame.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CrashGameClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bets<T extends CrashGame$betsArgs<ExtArgs> = {}>(args?: Subset<T, CrashGame$betsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrashBetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CrashGame model
   */
  interface CrashGameFieldRefs {
    readonly id: FieldRef<"CrashGame", 'String'>
    readonly crashPoint: FieldRef<"CrashGame", 'Float'>
    readonly startTime: FieldRef<"CrashGame", 'DateTime'>
    readonly status: FieldRef<"CrashGame", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CrashGame findUnique
   */
  export type CrashGameFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashGame
     */
    select?: CrashGameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashGame
     */
    omit?: CrashGameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashGameInclude<ExtArgs> | null
    /**
     * Filter, which CrashGame to fetch.
     */
    where: CrashGameWhereUniqueInput
  }

  /**
   * CrashGame findUniqueOrThrow
   */
  export type CrashGameFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashGame
     */
    select?: CrashGameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashGame
     */
    omit?: CrashGameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashGameInclude<ExtArgs> | null
    /**
     * Filter, which CrashGame to fetch.
     */
    where: CrashGameWhereUniqueInput
  }

  /**
   * CrashGame findFirst
   */
  export type CrashGameFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashGame
     */
    select?: CrashGameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashGame
     */
    omit?: CrashGameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashGameInclude<ExtArgs> | null
    /**
     * Filter, which CrashGame to fetch.
     */
    where?: CrashGameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrashGames to fetch.
     */
    orderBy?: CrashGameOrderByWithRelationInput | CrashGameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CrashGames.
     */
    cursor?: CrashGameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrashGames from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrashGames.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CrashGames.
     */
    distinct?: CrashGameScalarFieldEnum | CrashGameScalarFieldEnum[]
  }

  /**
   * CrashGame findFirstOrThrow
   */
  export type CrashGameFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashGame
     */
    select?: CrashGameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashGame
     */
    omit?: CrashGameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashGameInclude<ExtArgs> | null
    /**
     * Filter, which CrashGame to fetch.
     */
    where?: CrashGameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrashGames to fetch.
     */
    orderBy?: CrashGameOrderByWithRelationInput | CrashGameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CrashGames.
     */
    cursor?: CrashGameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrashGames from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrashGames.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CrashGames.
     */
    distinct?: CrashGameScalarFieldEnum | CrashGameScalarFieldEnum[]
  }

  /**
   * CrashGame findMany
   */
  export type CrashGameFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashGame
     */
    select?: CrashGameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashGame
     */
    omit?: CrashGameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashGameInclude<ExtArgs> | null
    /**
     * Filter, which CrashGames to fetch.
     */
    where?: CrashGameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrashGames to fetch.
     */
    orderBy?: CrashGameOrderByWithRelationInput | CrashGameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CrashGames.
     */
    cursor?: CrashGameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrashGames from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrashGames.
     */
    skip?: number
    distinct?: CrashGameScalarFieldEnum | CrashGameScalarFieldEnum[]
  }

  /**
   * CrashGame create
   */
  export type CrashGameCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashGame
     */
    select?: CrashGameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashGame
     */
    omit?: CrashGameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashGameInclude<ExtArgs> | null
    /**
     * The data needed to create a CrashGame.
     */
    data: XOR<CrashGameCreateInput, CrashGameUncheckedCreateInput>
  }

  /**
   * CrashGame createMany
   */
  export type CrashGameCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CrashGames.
     */
    data: CrashGameCreateManyInput | CrashGameCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CrashGame createManyAndReturn
   */
  export type CrashGameCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashGame
     */
    select?: CrashGameSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CrashGame
     */
    omit?: CrashGameOmit<ExtArgs> | null
    /**
     * The data used to create many CrashGames.
     */
    data: CrashGameCreateManyInput | CrashGameCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CrashGame update
   */
  export type CrashGameUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashGame
     */
    select?: CrashGameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashGame
     */
    omit?: CrashGameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashGameInclude<ExtArgs> | null
    /**
     * The data needed to update a CrashGame.
     */
    data: XOR<CrashGameUpdateInput, CrashGameUncheckedUpdateInput>
    /**
     * Choose, which CrashGame to update.
     */
    where: CrashGameWhereUniqueInput
  }

  /**
   * CrashGame updateMany
   */
  export type CrashGameUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CrashGames.
     */
    data: XOR<CrashGameUpdateManyMutationInput, CrashGameUncheckedUpdateManyInput>
    /**
     * Filter which CrashGames to update
     */
    where?: CrashGameWhereInput
    /**
     * Limit how many CrashGames to update.
     */
    limit?: number
  }

  /**
   * CrashGame updateManyAndReturn
   */
  export type CrashGameUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashGame
     */
    select?: CrashGameSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CrashGame
     */
    omit?: CrashGameOmit<ExtArgs> | null
    /**
     * The data used to update CrashGames.
     */
    data: XOR<CrashGameUpdateManyMutationInput, CrashGameUncheckedUpdateManyInput>
    /**
     * Filter which CrashGames to update
     */
    where?: CrashGameWhereInput
    /**
     * Limit how many CrashGames to update.
     */
    limit?: number
  }

  /**
   * CrashGame upsert
   */
  export type CrashGameUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashGame
     */
    select?: CrashGameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashGame
     */
    omit?: CrashGameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashGameInclude<ExtArgs> | null
    /**
     * The filter to search for the CrashGame to update in case it exists.
     */
    where: CrashGameWhereUniqueInput
    /**
     * In case the CrashGame found by the `where` argument doesn't exist, create a new CrashGame with this data.
     */
    create: XOR<CrashGameCreateInput, CrashGameUncheckedCreateInput>
    /**
     * In case the CrashGame was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CrashGameUpdateInput, CrashGameUncheckedUpdateInput>
  }

  /**
   * CrashGame delete
   */
  export type CrashGameDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashGame
     */
    select?: CrashGameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashGame
     */
    omit?: CrashGameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashGameInclude<ExtArgs> | null
    /**
     * Filter which CrashGame to delete.
     */
    where: CrashGameWhereUniqueInput
  }

  /**
   * CrashGame deleteMany
   */
  export type CrashGameDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CrashGames to delete
     */
    where?: CrashGameWhereInput
    /**
     * Limit how many CrashGames to delete.
     */
    limit?: number
  }

  /**
   * CrashGame.bets
   */
  export type CrashGame$betsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashBet
     */
    select?: CrashBetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashBet
     */
    omit?: CrashBetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashBetInclude<ExtArgs> | null
    where?: CrashBetWhereInput
    orderBy?: CrashBetOrderByWithRelationInput | CrashBetOrderByWithRelationInput[]
    cursor?: CrashBetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CrashBetScalarFieldEnum | CrashBetScalarFieldEnum[]
  }

  /**
   * CrashGame without action
   */
  export type CrashGameDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashGame
     */
    select?: CrashGameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashGame
     */
    omit?: CrashGameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashGameInclude<ExtArgs> | null
  }


  /**
   * Model CrashBet
   */

  export type AggregateCrashBet = {
    _count: CrashBetCountAggregateOutputType | null
    _avg: CrashBetAvgAggregateOutputType | null
    _sum: CrashBetSumAggregateOutputType | null
    _min: CrashBetMinAggregateOutputType | null
    _max: CrashBetMaxAggregateOutputType | null
  }

  export type CrashBetAvgAggregateOutputType = {
    amount: number | null
    cashedOutAt: number | null
    winAmount: number | null
  }

  export type CrashBetSumAggregateOutputType = {
    amount: number | null
    cashedOutAt: number | null
    winAmount: number | null
  }

  export type CrashBetMinAggregateOutputType = {
    id: string | null
    userId: string | null
    gameId: string | null
    amount: number | null
    cashedOutAt: number | null
    winAmount: number | null
    createdAt: Date | null
  }

  export type CrashBetMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    gameId: string | null
    amount: number | null
    cashedOutAt: number | null
    winAmount: number | null
    createdAt: Date | null
  }

  export type CrashBetCountAggregateOutputType = {
    id: number
    userId: number
    gameId: number
    amount: number
    cashedOutAt: number
    winAmount: number
    createdAt: number
    _all: number
  }


  export type CrashBetAvgAggregateInputType = {
    amount?: true
    cashedOutAt?: true
    winAmount?: true
  }

  export type CrashBetSumAggregateInputType = {
    amount?: true
    cashedOutAt?: true
    winAmount?: true
  }

  export type CrashBetMinAggregateInputType = {
    id?: true
    userId?: true
    gameId?: true
    amount?: true
    cashedOutAt?: true
    winAmount?: true
    createdAt?: true
  }

  export type CrashBetMaxAggregateInputType = {
    id?: true
    userId?: true
    gameId?: true
    amount?: true
    cashedOutAt?: true
    winAmount?: true
    createdAt?: true
  }

  export type CrashBetCountAggregateInputType = {
    id?: true
    userId?: true
    gameId?: true
    amount?: true
    cashedOutAt?: true
    winAmount?: true
    createdAt?: true
    _all?: true
  }

  export type CrashBetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CrashBet to aggregate.
     */
    where?: CrashBetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrashBets to fetch.
     */
    orderBy?: CrashBetOrderByWithRelationInput | CrashBetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CrashBetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrashBets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrashBets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CrashBets
    **/
    _count?: true | CrashBetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CrashBetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CrashBetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CrashBetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CrashBetMaxAggregateInputType
  }

  export type GetCrashBetAggregateType<T extends CrashBetAggregateArgs> = {
        [P in keyof T & keyof AggregateCrashBet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCrashBet[P]>
      : GetScalarType<T[P], AggregateCrashBet[P]>
  }




  export type CrashBetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CrashBetWhereInput
    orderBy?: CrashBetOrderByWithAggregationInput | CrashBetOrderByWithAggregationInput[]
    by: CrashBetScalarFieldEnum[] | CrashBetScalarFieldEnum
    having?: CrashBetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CrashBetCountAggregateInputType | true
    _avg?: CrashBetAvgAggregateInputType
    _sum?: CrashBetSumAggregateInputType
    _min?: CrashBetMinAggregateInputType
    _max?: CrashBetMaxAggregateInputType
  }

  export type CrashBetGroupByOutputType = {
    id: string
    userId: string
    gameId: string
    amount: number
    cashedOutAt: number | null
    winAmount: number | null
    createdAt: Date
    _count: CrashBetCountAggregateOutputType | null
    _avg: CrashBetAvgAggregateOutputType | null
    _sum: CrashBetSumAggregateOutputType | null
    _min: CrashBetMinAggregateOutputType | null
    _max: CrashBetMaxAggregateOutputType | null
  }

  type GetCrashBetGroupByPayload<T extends CrashBetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CrashBetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CrashBetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CrashBetGroupByOutputType[P]>
            : GetScalarType<T[P], CrashBetGroupByOutputType[P]>
        }
      >
    >


  export type CrashBetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    gameId?: boolean
    amount?: boolean
    cashedOutAt?: boolean
    winAmount?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    game?: boolean | CrashGameDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["crashBet"]>

  export type CrashBetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    gameId?: boolean
    amount?: boolean
    cashedOutAt?: boolean
    winAmount?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    game?: boolean | CrashGameDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["crashBet"]>

  export type CrashBetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    gameId?: boolean
    amount?: boolean
    cashedOutAt?: boolean
    winAmount?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    game?: boolean | CrashGameDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["crashBet"]>

  export type CrashBetSelectScalar = {
    id?: boolean
    userId?: boolean
    gameId?: boolean
    amount?: boolean
    cashedOutAt?: boolean
    winAmount?: boolean
    createdAt?: boolean
  }

  export type CrashBetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "gameId" | "amount" | "cashedOutAt" | "winAmount" | "createdAt", ExtArgs["result"]["crashBet"]>
  export type CrashBetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    game?: boolean | CrashGameDefaultArgs<ExtArgs>
  }
  export type CrashBetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    game?: boolean | CrashGameDefaultArgs<ExtArgs>
  }
  export type CrashBetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    game?: boolean | CrashGameDefaultArgs<ExtArgs>
  }

  export type $CrashBetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CrashBet"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      game: Prisma.$CrashGamePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      gameId: string
      amount: number
      cashedOutAt: number | null
      winAmount: number | null
      createdAt: Date
    }, ExtArgs["result"]["crashBet"]>
    composites: {}
  }

  type CrashBetGetPayload<S extends boolean | null | undefined | CrashBetDefaultArgs> = $Result.GetResult<Prisma.$CrashBetPayload, S>

  type CrashBetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CrashBetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CrashBetCountAggregateInputType | true
    }

  export interface CrashBetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CrashBet'], meta: { name: 'CrashBet' } }
    /**
     * Find zero or one CrashBet that matches the filter.
     * @param {CrashBetFindUniqueArgs} args - Arguments to find a CrashBet
     * @example
     * // Get one CrashBet
     * const crashBet = await prisma.crashBet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CrashBetFindUniqueArgs>(args: SelectSubset<T, CrashBetFindUniqueArgs<ExtArgs>>): Prisma__CrashBetClient<$Result.GetResult<Prisma.$CrashBetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CrashBet that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CrashBetFindUniqueOrThrowArgs} args - Arguments to find a CrashBet
     * @example
     * // Get one CrashBet
     * const crashBet = await prisma.crashBet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CrashBetFindUniqueOrThrowArgs>(args: SelectSubset<T, CrashBetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CrashBetClient<$Result.GetResult<Prisma.$CrashBetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CrashBet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashBetFindFirstArgs} args - Arguments to find a CrashBet
     * @example
     * // Get one CrashBet
     * const crashBet = await prisma.crashBet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CrashBetFindFirstArgs>(args?: SelectSubset<T, CrashBetFindFirstArgs<ExtArgs>>): Prisma__CrashBetClient<$Result.GetResult<Prisma.$CrashBetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CrashBet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashBetFindFirstOrThrowArgs} args - Arguments to find a CrashBet
     * @example
     * // Get one CrashBet
     * const crashBet = await prisma.crashBet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CrashBetFindFirstOrThrowArgs>(args?: SelectSubset<T, CrashBetFindFirstOrThrowArgs<ExtArgs>>): Prisma__CrashBetClient<$Result.GetResult<Prisma.$CrashBetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CrashBets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashBetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CrashBets
     * const crashBets = await prisma.crashBet.findMany()
     * 
     * // Get first 10 CrashBets
     * const crashBets = await prisma.crashBet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const crashBetWithIdOnly = await prisma.crashBet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CrashBetFindManyArgs>(args?: SelectSubset<T, CrashBetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrashBetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CrashBet.
     * @param {CrashBetCreateArgs} args - Arguments to create a CrashBet.
     * @example
     * // Create one CrashBet
     * const CrashBet = await prisma.crashBet.create({
     *   data: {
     *     // ... data to create a CrashBet
     *   }
     * })
     * 
     */
    create<T extends CrashBetCreateArgs>(args: SelectSubset<T, CrashBetCreateArgs<ExtArgs>>): Prisma__CrashBetClient<$Result.GetResult<Prisma.$CrashBetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CrashBets.
     * @param {CrashBetCreateManyArgs} args - Arguments to create many CrashBets.
     * @example
     * // Create many CrashBets
     * const crashBet = await prisma.crashBet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CrashBetCreateManyArgs>(args?: SelectSubset<T, CrashBetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CrashBets and returns the data saved in the database.
     * @param {CrashBetCreateManyAndReturnArgs} args - Arguments to create many CrashBets.
     * @example
     * // Create many CrashBets
     * const crashBet = await prisma.crashBet.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CrashBets and only return the `id`
     * const crashBetWithIdOnly = await prisma.crashBet.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CrashBetCreateManyAndReturnArgs>(args?: SelectSubset<T, CrashBetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrashBetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CrashBet.
     * @param {CrashBetDeleteArgs} args - Arguments to delete one CrashBet.
     * @example
     * // Delete one CrashBet
     * const CrashBet = await prisma.crashBet.delete({
     *   where: {
     *     // ... filter to delete one CrashBet
     *   }
     * })
     * 
     */
    delete<T extends CrashBetDeleteArgs>(args: SelectSubset<T, CrashBetDeleteArgs<ExtArgs>>): Prisma__CrashBetClient<$Result.GetResult<Prisma.$CrashBetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CrashBet.
     * @param {CrashBetUpdateArgs} args - Arguments to update one CrashBet.
     * @example
     * // Update one CrashBet
     * const crashBet = await prisma.crashBet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CrashBetUpdateArgs>(args: SelectSubset<T, CrashBetUpdateArgs<ExtArgs>>): Prisma__CrashBetClient<$Result.GetResult<Prisma.$CrashBetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CrashBets.
     * @param {CrashBetDeleteManyArgs} args - Arguments to filter CrashBets to delete.
     * @example
     * // Delete a few CrashBets
     * const { count } = await prisma.crashBet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CrashBetDeleteManyArgs>(args?: SelectSubset<T, CrashBetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CrashBets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashBetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CrashBets
     * const crashBet = await prisma.crashBet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CrashBetUpdateManyArgs>(args: SelectSubset<T, CrashBetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CrashBets and returns the data updated in the database.
     * @param {CrashBetUpdateManyAndReturnArgs} args - Arguments to update many CrashBets.
     * @example
     * // Update many CrashBets
     * const crashBet = await prisma.crashBet.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CrashBets and only return the `id`
     * const crashBetWithIdOnly = await prisma.crashBet.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CrashBetUpdateManyAndReturnArgs>(args: SelectSubset<T, CrashBetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrashBetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CrashBet.
     * @param {CrashBetUpsertArgs} args - Arguments to update or create a CrashBet.
     * @example
     * // Update or create a CrashBet
     * const crashBet = await prisma.crashBet.upsert({
     *   create: {
     *     // ... data to create a CrashBet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CrashBet we want to update
     *   }
     * })
     */
    upsert<T extends CrashBetUpsertArgs>(args: SelectSubset<T, CrashBetUpsertArgs<ExtArgs>>): Prisma__CrashBetClient<$Result.GetResult<Prisma.$CrashBetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CrashBets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashBetCountArgs} args - Arguments to filter CrashBets to count.
     * @example
     * // Count the number of CrashBets
     * const count = await prisma.crashBet.count({
     *   where: {
     *     // ... the filter for the CrashBets we want to count
     *   }
     * })
    **/
    count<T extends CrashBetCountArgs>(
      args?: Subset<T, CrashBetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CrashBetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CrashBet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashBetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CrashBetAggregateArgs>(args: Subset<T, CrashBetAggregateArgs>): Prisma.PrismaPromise<GetCrashBetAggregateType<T>>

    /**
     * Group by CrashBet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrashBetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CrashBetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CrashBetGroupByArgs['orderBy'] }
        : { orderBy?: CrashBetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CrashBetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCrashBetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CrashBet model
   */
  readonly fields: CrashBetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CrashBet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CrashBetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    game<T extends CrashGameDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CrashGameDefaultArgs<ExtArgs>>): Prisma__CrashGameClient<$Result.GetResult<Prisma.$CrashGamePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CrashBet model
   */
  interface CrashBetFieldRefs {
    readonly id: FieldRef<"CrashBet", 'String'>
    readonly userId: FieldRef<"CrashBet", 'String'>
    readonly gameId: FieldRef<"CrashBet", 'String'>
    readonly amount: FieldRef<"CrashBet", 'Int'>
    readonly cashedOutAt: FieldRef<"CrashBet", 'Float'>
    readonly winAmount: FieldRef<"CrashBet", 'Int'>
    readonly createdAt: FieldRef<"CrashBet", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CrashBet findUnique
   */
  export type CrashBetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashBet
     */
    select?: CrashBetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashBet
     */
    omit?: CrashBetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashBetInclude<ExtArgs> | null
    /**
     * Filter, which CrashBet to fetch.
     */
    where: CrashBetWhereUniqueInput
  }

  /**
   * CrashBet findUniqueOrThrow
   */
  export type CrashBetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashBet
     */
    select?: CrashBetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashBet
     */
    omit?: CrashBetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashBetInclude<ExtArgs> | null
    /**
     * Filter, which CrashBet to fetch.
     */
    where: CrashBetWhereUniqueInput
  }

  /**
   * CrashBet findFirst
   */
  export type CrashBetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashBet
     */
    select?: CrashBetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashBet
     */
    omit?: CrashBetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashBetInclude<ExtArgs> | null
    /**
     * Filter, which CrashBet to fetch.
     */
    where?: CrashBetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrashBets to fetch.
     */
    orderBy?: CrashBetOrderByWithRelationInput | CrashBetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CrashBets.
     */
    cursor?: CrashBetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrashBets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrashBets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CrashBets.
     */
    distinct?: CrashBetScalarFieldEnum | CrashBetScalarFieldEnum[]
  }

  /**
   * CrashBet findFirstOrThrow
   */
  export type CrashBetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashBet
     */
    select?: CrashBetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashBet
     */
    omit?: CrashBetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashBetInclude<ExtArgs> | null
    /**
     * Filter, which CrashBet to fetch.
     */
    where?: CrashBetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrashBets to fetch.
     */
    orderBy?: CrashBetOrderByWithRelationInput | CrashBetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CrashBets.
     */
    cursor?: CrashBetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrashBets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrashBets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CrashBets.
     */
    distinct?: CrashBetScalarFieldEnum | CrashBetScalarFieldEnum[]
  }

  /**
   * CrashBet findMany
   */
  export type CrashBetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashBet
     */
    select?: CrashBetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashBet
     */
    omit?: CrashBetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashBetInclude<ExtArgs> | null
    /**
     * Filter, which CrashBets to fetch.
     */
    where?: CrashBetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrashBets to fetch.
     */
    orderBy?: CrashBetOrderByWithRelationInput | CrashBetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CrashBets.
     */
    cursor?: CrashBetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrashBets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrashBets.
     */
    skip?: number
    distinct?: CrashBetScalarFieldEnum | CrashBetScalarFieldEnum[]
  }

  /**
   * CrashBet create
   */
  export type CrashBetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashBet
     */
    select?: CrashBetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashBet
     */
    omit?: CrashBetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashBetInclude<ExtArgs> | null
    /**
     * The data needed to create a CrashBet.
     */
    data: XOR<CrashBetCreateInput, CrashBetUncheckedCreateInput>
  }

  /**
   * CrashBet createMany
   */
  export type CrashBetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CrashBets.
     */
    data: CrashBetCreateManyInput | CrashBetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CrashBet createManyAndReturn
   */
  export type CrashBetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashBet
     */
    select?: CrashBetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CrashBet
     */
    omit?: CrashBetOmit<ExtArgs> | null
    /**
     * The data used to create many CrashBets.
     */
    data: CrashBetCreateManyInput | CrashBetCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashBetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CrashBet update
   */
  export type CrashBetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashBet
     */
    select?: CrashBetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashBet
     */
    omit?: CrashBetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashBetInclude<ExtArgs> | null
    /**
     * The data needed to update a CrashBet.
     */
    data: XOR<CrashBetUpdateInput, CrashBetUncheckedUpdateInput>
    /**
     * Choose, which CrashBet to update.
     */
    where: CrashBetWhereUniqueInput
  }

  /**
   * CrashBet updateMany
   */
  export type CrashBetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CrashBets.
     */
    data: XOR<CrashBetUpdateManyMutationInput, CrashBetUncheckedUpdateManyInput>
    /**
     * Filter which CrashBets to update
     */
    where?: CrashBetWhereInput
    /**
     * Limit how many CrashBets to update.
     */
    limit?: number
  }

  /**
   * CrashBet updateManyAndReturn
   */
  export type CrashBetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashBet
     */
    select?: CrashBetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CrashBet
     */
    omit?: CrashBetOmit<ExtArgs> | null
    /**
     * The data used to update CrashBets.
     */
    data: XOR<CrashBetUpdateManyMutationInput, CrashBetUncheckedUpdateManyInput>
    /**
     * Filter which CrashBets to update
     */
    where?: CrashBetWhereInput
    /**
     * Limit how many CrashBets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashBetIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CrashBet upsert
   */
  export type CrashBetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashBet
     */
    select?: CrashBetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashBet
     */
    omit?: CrashBetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashBetInclude<ExtArgs> | null
    /**
     * The filter to search for the CrashBet to update in case it exists.
     */
    where: CrashBetWhereUniqueInput
    /**
     * In case the CrashBet found by the `where` argument doesn't exist, create a new CrashBet with this data.
     */
    create: XOR<CrashBetCreateInput, CrashBetUncheckedCreateInput>
    /**
     * In case the CrashBet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CrashBetUpdateInput, CrashBetUncheckedUpdateInput>
  }

  /**
   * CrashBet delete
   */
  export type CrashBetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashBet
     */
    select?: CrashBetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashBet
     */
    omit?: CrashBetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashBetInclude<ExtArgs> | null
    /**
     * Filter which CrashBet to delete.
     */
    where: CrashBetWhereUniqueInput
  }

  /**
   * CrashBet deleteMany
   */
  export type CrashBetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CrashBets to delete
     */
    where?: CrashBetWhereInput
    /**
     * Limit how many CrashBets to delete.
     */
    limit?: number
  }

  /**
   * CrashBet without action
   */
  export type CrashBetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrashBet
     */
    select?: CrashBetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrashBet
     */
    omit?: CrashBetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CrashBetInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    password: 'password',
    credits: 'credits',
    lastDailyReward: 'lastDailyReward',
    role: 'role'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const GameRoomScalarFieldEnum: {
    id: 'id',
    players: 'players',
    dealer: 'dealer',
    deck: 'deck',
    currentPlayerIndex: 'currentPlayerIndex',
    gameStarted: 'gameStarted',
    gameEnded: 'gameEnded',
    createdAt: 'createdAt',
    maxPlayers: 'maxPlayers'
  };

  export type GameRoomScalarFieldEnum = (typeof GameRoomScalarFieldEnum)[keyof typeof GameRoomScalarFieldEnum]


  export const CrashGameScalarFieldEnum: {
    id: 'id',
    crashPoint: 'crashPoint',
    startTime: 'startTime',
    status: 'status'
  };

  export type CrashGameScalarFieldEnum = (typeof CrashGameScalarFieldEnum)[keyof typeof CrashGameScalarFieldEnum]


  export const CrashBetScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    gameId: 'gameId',
    amount: 'amount',
    cashedOutAt: 'cashedOutAt',
    winAmount: 'winAmount',
    createdAt: 'createdAt'
  };

  export type CrashBetScalarFieldEnum = (typeof CrashBetScalarFieldEnum)[keyof typeof CrashBetScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    credits?: IntFilter<"User"> | number
    lastDailyReward?: DateTimeNullableFilter<"User"> | Date | string | null
    role?: StringFilter<"User"> | string
    crashBets?: CrashBetListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    credits?: SortOrder
    lastDailyReward?: SortOrderInput | SortOrder
    role?: SortOrder
    crashBets?: CrashBetOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    credits?: IntFilter<"User"> | number
    lastDailyReward?: DateTimeNullableFilter<"User"> | Date | string | null
    role?: StringFilter<"User"> | string
    crashBets?: CrashBetListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    credits?: SortOrder
    lastDailyReward?: SortOrderInput | SortOrder
    role?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    credits?: IntWithAggregatesFilter<"User"> | number
    lastDailyReward?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    role?: StringWithAggregatesFilter<"User"> | string
  }

  export type GameRoomWhereInput = {
    AND?: GameRoomWhereInput | GameRoomWhereInput[]
    OR?: GameRoomWhereInput[]
    NOT?: GameRoomWhereInput | GameRoomWhereInput[]
    id?: StringFilter<"GameRoom"> | string
    players?: JsonFilter<"GameRoom">
    dealer?: JsonFilter<"GameRoom">
    deck?: JsonFilter<"GameRoom">
    currentPlayerIndex?: IntFilter<"GameRoom"> | number
    gameStarted?: BoolFilter<"GameRoom"> | boolean
    gameEnded?: BoolFilter<"GameRoom"> | boolean
    createdAt?: DateTimeFilter<"GameRoom"> | Date | string
    maxPlayers?: IntFilter<"GameRoom"> | number
  }

  export type GameRoomOrderByWithRelationInput = {
    id?: SortOrder
    players?: SortOrder
    dealer?: SortOrder
    deck?: SortOrder
    currentPlayerIndex?: SortOrder
    gameStarted?: SortOrder
    gameEnded?: SortOrder
    createdAt?: SortOrder
    maxPlayers?: SortOrder
  }

  export type GameRoomWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GameRoomWhereInput | GameRoomWhereInput[]
    OR?: GameRoomWhereInput[]
    NOT?: GameRoomWhereInput | GameRoomWhereInput[]
    players?: JsonFilter<"GameRoom">
    dealer?: JsonFilter<"GameRoom">
    deck?: JsonFilter<"GameRoom">
    currentPlayerIndex?: IntFilter<"GameRoom"> | number
    gameStarted?: BoolFilter<"GameRoom"> | boolean
    gameEnded?: BoolFilter<"GameRoom"> | boolean
    createdAt?: DateTimeFilter<"GameRoom"> | Date | string
    maxPlayers?: IntFilter<"GameRoom"> | number
  }, "id">

  export type GameRoomOrderByWithAggregationInput = {
    id?: SortOrder
    players?: SortOrder
    dealer?: SortOrder
    deck?: SortOrder
    currentPlayerIndex?: SortOrder
    gameStarted?: SortOrder
    gameEnded?: SortOrder
    createdAt?: SortOrder
    maxPlayers?: SortOrder
    _count?: GameRoomCountOrderByAggregateInput
    _avg?: GameRoomAvgOrderByAggregateInput
    _max?: GameRoomMaxOrderByAggregateInput
    _min?: GameRoomMinOrderByAggregateInput
    _sum?: GameRoomSumOrderByAggregateInput
  }

  export type GameRoomScalarWhereWithAggregatesInput = {
    AND?: GameRoomScalarWhereWithAggregatesInput | GameRoomScalarWhereWithAggregatesInput[]
    OR?: GameRoomScalarWhereWithAggregatesInput[]
    NOT?: GameRoomScalarWhereWithAggregatesInput | GameRoomScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GameRoom"> | string
    players?: JsonWithAggregatesFilter<"GameRoom">
    dealer?: JsonWithAggregatesFilter<"GameRoom">
    deck?: JsonWithAggregatesFilter<"GameRoom">
    currentPlayerIndex?: IntWithAggregatesFilter<"GameRoom"> | number
    gameStarted?: BoolWithAggregatesFilter<"GameRoom"> | boolean
    gameEnded?: BoolWithAggregatesFilter<"GameRoom"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"GameRoom"> | Date | string
    maxPlayers?: IntWithAggregatesFilter<"GameRoom"> | number
  }

  export type CrashGameWhereInput = {
    AND?: CrashGameWhereInput | CrashGameWhereInput[]
    OR?: CrashGameWhereInput[]
    NOT?: CrashGameWhereInput | CrashGameWhereInput[]
    id?: StringFilter<"CrashGame"> | string
    crashPoint?: FloatFilter<"CrashGame"> | number
    startTime?: DateTimeFilter<"CrashGame"> | Date | string
    status?: StringFilter<"CrashGame"> | string
    bets?: CrashBetListRelationFilter
  }

  export type CrashGameOrderByWithRelationInput = {
    id?: SortOrder
    crashPoint?: SortOrder
    startTime?: SortOrder
    status?: SortOrder
    bets?: CrashBetOrderByRelationAggregateInput
  }

  export type CrashGameWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CrashGameWhereInput | CrashGameWhereInput[]
    OR?: CrashGameWhereInput[]
    NOT?: CrashGameWhereInput | CrashGameWhereInput[]
    crashPoint?: FloatFilter<"CrashGame"> | number
    startTime?: DateTimeFilter<"CrashGame"> | Date | string
    status?: StringFilter<"CrashGame"> | string
    bets?: CrashBetListRelationFilter
  }, "id">

  export type CrashGameOrderByWithAggregationInput = {
    id?: SortOrder
    crashPoint?: SortOrder
    startTime?: SortOrder
    status?: SortOrder
    _count?: CrashGameCountOrderByAggregateInput
    _avg?: CrashGameAvgOrderByAggregateInput
    _max?: CrashGameMaxOrderByAggregateInput
    _min?: CrashGameMinOrderByAggregateInput
    _sum?: CrashGameSumOrderByAggregateInput
  }

  export type CrashGameScalarWhereWithAggregatesInput = {
    AND?: CrashGameScalarWhereWithAggregatesInput | CrashGameScalarWhereWithAggregatesInput[]
    OR?: CrashGameScalarWhereWithAggregatesInput[]
    NOT?: CrashGameScalarWhereWithAggregatesInput | CrashGameScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CrashGame"> | string
    crashPoint?: FloatWithAggregatesFilter<"CrashGame"> | number
    startTime?: DateTimeWithAggregatesFilter<"CrashGame"> | Date | string
    status?: StringWithAggregatesFilter<"CrashGame"> | string
  }

  export type CrashBetWhereInput = {
    AND?: CrashBetWhereInput | CrashBetWhereInput[]
    OR?: CrashBetWhereInput[]
    NOT?: CrashBetWhereInput | CrashBetWhereInput[]
    id?: StringFilter<"CrashBet"> | string
    userId?: StringFilter<"CrashBet"> | string
    gameId?: StringFilter<"CrashBet"> | string
    amount?: IntFilter<"CrashBet"> | number
    cashedOutAt?: FloatNullableFilter<"CrashBet"> | number | null
    winAmount?: IntNullableFilter<"CrashBet"> | number | null
    createdAt?: DateTimeFilter<"CrashBet"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    game?: XOR<CrashGameScalarRelationFilter, CrashGameWhereInput>
  }

  export type CrashBetOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    gameId?: SortOrder
    amount?: SortOrder
    cashedOutAt?: SortOrderInput | SortOrder
    winAmount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    game?: CrashGameOrderByWithRelationInput
  }

  export type CrashBetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CrashBetWhereInput | CrashBetWhereInput[]
    OR?: CrashBetWhereInput[]
    NOT?: CrashBetWhereInput | CrashBetWhereInput[]
    userId?: StringFilter<"CrashBet"> | string
    gameId?: StringFilter<"CrashBet"> | string
    amount?: IntFilter<"CrashBet"> | number
    cashedOutAt?: FloatNullableFilter<"CrashBet"> | number | null
    winAmount?: IntNullableFilter<"CrashBet"> | number | null
    createdAt?: DateTimeFilter<"CrashBet"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    game?: XOR<CrashGameScalarRelationFilter, CrashGameWhereInput>
  }, "id">

  export type CrashBetOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    gameId?: SortOrder
    amount?: SortOrder
    cashedOutAt?: SortOrderInput | SortOrder
    winAmount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CrashBetCountOrderByAggregateInput
    _avg?: CrashBetAvgOrderByAggregateInput
    _max?: CrashBetMaxOrderByAggregateInput
    _min?: CrashBetMinOrderByAggregateInput
    _sum?: CrashBetSumOrderByAggregateInput
  }

  export type CrashBetScalarWhereWithAggregatesInput = {
    AND?: CrashBetScalarWhereWithAggregatesInput | CrashBetScalarWhereWithAggregatesInput[]
    OR?: CrashBetScalarWhereWithAggregatesInput[]
    NOT?: CrashBetScalarWhereWithAggregatesInput | CrashBetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CrashBet"> | string
    userId?: StringWithAggregatesFilter<"CrashBet"> | string
    gameId?: StringWithAggregatesFilter<"CrashBet"> | string
    amount?: IntWithAggregatesFilter<"CrashBet"> | number
    cashedOutAt?: FloatNullableWithAggregatesFilter<"CrashBet"> | number | null
    winAmount?: IntNullableWithAggregatesFilter<"CrashBet"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"CrashBet"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    credits?: number
    lastDailyReward?: Date | string | null
    role?: string
    crashBets?: CrashBetCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    credits?: number
    lastDailyReward?: Date | string | null
    role?: string
    crashBets?: CrashBetUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: IntFieldUpdateOperationsInput | number
    lastDailyReward?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    crashBets?: CrashBetUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: IntFieldUpdateOperationsInput | number
    lastDailyReward?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    crashBets?: CrashBetUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    credits?: number
    lastDailyReward?: Date | string | null
    role?: string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: IntFieldUpdateOperationsInput | number
    lastDailyReward?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: IntFieldUpdateOperationsInput | number
    lastDailyReward?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
  }

  export type GameRoomCreateInput = {
    id: string
    players: JsonNullValueInput | InputJsonValue
    dealer: JsonNullValueInput | InputJsonValue
    deck: JsonNullValueInput | InputJsonValue
    currentPlayerIndex: number
    gameStarted?: boolean
    gameEnded?: boolean
    createdAt?: Date | string
    maxPlayers: number
  }

  export type GameRoomUncheckedCreateInput = {
    id: string
    players: JsonNullValueInput | InputJsonValue
    dealer: JsonNullValueInput | InputJsonValue
    deck: JsonNullValueInput | InputJsonValue
    currentPlayerIndex: number
    gameStarted?: boolean
    gameEnded?: boolean
    createdAt?: Date | string
    maxPlayers: number
  }

  export type GameRoomUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    players?: JsonNullValueInput | InputJsonValue
    dealer?: JsonNullValueInput | InputJsonValue
    deck?: JsonNullValueInput | InputJsonValue
    currentPlayerIndex?: IntFieldUpdateOperationsInput | number
    gameStarted?: BoolFieldUpdateOperationsInput | boolean
    gameEnded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
  }

  export type GameRoomUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    players?: JsonNullValueInput | InputJsonValue
    dealer?: JsonNullValueInput | InputJsonValue
    deck?: JsonNullValueInput | InputJsonValue
    currentPlayerIndex?: IntFieldUpdateOperationsInput | number
    gameStarted?: BoolFieldUpdateOperationsInput | boolean
    gameEnded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
  }

  export type GameRoomCreateManyInput = {
    id: string
    players: JsonNullValueInput | InputJsonValue
    dealer: JsonNullValueInput | InputJsonValue
    deck: JsonNullValueInput | InputJsonValue
    currentPlayerIndex: number
    gameStarted?: boolean
    gameEnded?: boolean
    createdAt?: Date | string
    maxPlayers: number
  }

  export type GameRoomUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    players?: JsonNullValueInput | InputJsonValue
    dealer?: JsonNullValueInput | InputJsonValue
    deck?: JsonNullValueInput | InputJsonValue
    currentPlayerIndex?: IntFieldUpdateOperationsInput | number
    gameStarted?: BoolFieldUpdateOperationsInput | boolean
    gameEnded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
  }

  export type GameRoomUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    players?: JsonNullValueInput | InputJsonValue
    dealer?: JsonNullValueInput | InputJsonValue
    deck?: JsonNullValueInput | InputJsonValue
    currentPlayerIndex?: IntFieldUpdateOperationsInput | number
    gameStarted?: BoolFieldUpdateOperationsInput | boolean
    gameEnded?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
  }

  export type CrashGameCreateInput = {
    id: string
    crashPoint: number
    startTime?: Date | string
    status: string
    bets?: CrashBetCreateNestedManyWithoutGameInput
  }

  export type CrashGameUncheckedCreateInput = {
    id: string
    crashPoint: number
    startTime?: Date | string
    status: string
    bets?: CrashBetUncheckedCreateNestedManyWithoutGameInput
  }

  export type CrashGameUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    crashPoint?: FloatFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    bets?: CrashBetUpdateManyWithoutGameNestedInput
  }

  export type CrashGameUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    crashPoint?: FloatFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    bets?: CrashBetUncheckedUpdateManyWithoutGameNestedInput
  }

  export type CrashGameCreateManyInput = {
    id: string
    crashPoint: number
    startTime?: Date | string
    status: string
  }

  export type CrashGameUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    crashPoint?: FloatFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type CrashGameUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    crashPoint?: FloatFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type CrashBetCreateInput = {
    id?: string
    amount: number
    cashedOutAt?: number | null
    winAmount?: number | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutCrashBetsInput
    game: CrashGameCreateNestedOneWithoutBetsInput
  }

  export type CrashBetUncheckedCreateInput = {
    id?: string
    userId: string
    gameId: string
    amount: number
    cashedOutAt?: number | null
    winAmount?: number | null
    createdAt?: Date | string
  }

  export type CrashBetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    cashedOutAt?: NullableFloatFieldUpdateOperationsInput | number | null
    winAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCrashBetsNestedInput
    game?: CrashGameUpdateOneRequiredWithoutBetsNestedInput
  }

  export type CrashBetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    cashedOutAt?: NullableFloatFieldUpdateOperationsInput | number | null
    winAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrashBetCreateManyInput = {
    id?: string
    userId: string
    gameId: string
    amount: number
    cashedOutAt?: number | null
    winAmount?: number | null
    createdAt?: Date | string
  }

  export type CrashBetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    cashedOutAt?: NullableFloatFieldUpdateOperationsInput | number | null
    winAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrashBetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    cashedOutAt?: NullableFloatFieldUpdateOperationsInput | number | null
    winAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type CrashBetListRelationFilter = {
    every?: CrashBetWhereInput
    some?: CrashBetWhereInput
    none?: CrashBetWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CrashBetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    password?: SortOrder
    credits?: SortOrder
    lastDailyReward?: SortOrder
    role?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    credits?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    password?: SortOrder
    credits?: SortOrder
    lastDailyReward?: SortOrder
    role?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    password?: SortOrder
    credits?: SortOrder
    lastDailyReward?: SortOrder
    role?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    credits?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type GameRoomCountOrderByAggregateInput = {
    id?: SortOrder
    players?: SortOrder
    dealer?: SortOrder
    deck?: SortOrder
    currentPlayerIndex?: SortOrder
    gameStarted?: SortOrder
    gameEnded?: SortOrder
    createdAt?: SortOrder
    maxPlayers?: SortOrder
  }

  export type GameRoomAvgOrderByAggregateInput = {
    currentPlayerIndex?: SortOrder
    maxPlayers?: SortOrder
  }

  export type GameRoomMaxOrderByAggregateInput = {
    id?: SortOrder
    currentPlayerIndex?: SortOrder
    gameStarted?: SortOrder
    gameEnded?: SortOrder
    createdAt?: SortOrder
    maxPlayers?: SortOrder
  }

  export type GameRoomMinOrderByAggregateInput = {
    id?: SortOrder
    currentPlayerIndex?: SortOrder
    gameStarted?: SortOrder
    gameEnded?: SortOrder
    createdAt?: SortOrder
    maxPlayers?: SortOrder
  }

  export type GameRoomSumOrderByAggregateInput = {
    currentPlayerIndex?: SortOrder
    maxPlayers?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type CrashGameCountOrderByAggregateInput = {
    id?: SortOrder
    crashPoint?: SortOrder
    startTime?: SortOrder
    status?: SortOrder
  }

  export type CrashGameAvgOrderByAggregateInput = {
    crashPoint?: SortOrder
  }

  export type CrashGameMaxOrderByAggregateInput = {
    id?: SortOrder
    crashPoint?: SortOrder
    startTime?: SortOrder
    status?: SortOrder
  }

  export type CrashGameMinOrderByAggregateInput = {
    id?: SortOrder
    crashPoint?: SortOrder
    startTime?: SortOrder
    status?: SortOrder
  }

  export type CrashGameSumOrderByAggregateInput = {
    crashPoint?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CrashGameScalarRelationFilter = {
    is?: CrashGameWhereInput
    isNot?: CrashGameWhereInput
  }

  export type CrashBetCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    gameId?: SortOrder
    amount?: SortOrder
    cashedOutAt?: SortOrder
    winAmount?: SortOrder
    createdAt?: SortOrder
  }

  export type CrashBetAvgOrderByAggregateInput = {
    amount?: SortOrder
    cashedOutAt?: SortOrder
    winAmount?: SortOrder
  }

  export type CrashBetMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    gameId?: SortOrder
    amount?: SortOrder
    cashedOutAt?: SortOrder
    winAmount?: SortOrder
    createdAt?: SortOrder
  }

  export type CrashBetMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    gameId?: SortOrder
    amount?: SortOrder
    cashedOutAt?: SortOrder
    winAmount?: SortOrder
    createdAt?: SortOrder
  }

  export type CrashBetSumOrderByAggregateInput = {
    amount?: SortOrder
    cashedOutAt?: SortOrder
    winAmount?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type CrashBetCreateNestedManyWithoutUserInput = {
    create?: XOR<CrashBetCreateWithoutUserInput, CrashBetUncheckedCreateWithoutUserInput> | CrashBetCreateWithoutUserInput[] | CrashBetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CrashBetCreateOrConnectWithoutUserInput | CrashBetCreateOrConnectWithoutUserInput[]
    createMany?: CrashBetCreateManyUserInputEnvelope
    connect?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
  }

  export type CrashBetUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CrashBetCreateWithoutUserInput, CrashBetUncheckedCreateWithoutUserInput> | CrashBetCreateWithoutUserInput[] | CrashBetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CrashBetCreateOrConnectWithoutUserInput | CrashBetCreateOrConnectWithoutUserInput[]
    createMany?: CrashBetCreateManyUserInputEnvelope
    connect?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CrashBetUpdateManyWithoutUserNestedInput = {
    create?: XOR<CrashBetCreateWithoutUserInput, CrashBetUncheckedCreateWithoutUserInput> | CrashBetCreateWithoutUserInput[] | CrashBetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CrashBetCreateOrConnectWithoutUserInput | CrashBetCreateOrConnectWithoutUserInput[]
    upsert?: CrashBetUpsertWithWhereUniqueWithoutUserInput | CrashBetUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CrashBetCreateManyUserInputEnvelope
    set?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
    disconnect?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
    delete?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
    connect?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
    update?: CrashBetUpdateWithWhereUniqueWithoutUserInput | CrashBetUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CrashBetUpdateManyWithWhereWithoutUserInput | CrashBetUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CrashBetScalarWhereInput | CrashBetScalarWhereInput[]
  }

  export type CrashBetUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CrashBetCreateWithoutUserInput, CrashBetUncheckedCreateWithoutUserInput> | CrashBetCreateWithoutUserInput[] | CrashBetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CrashBetCreateOrConnectWithoutUserInput | CrashBetCreateOrConnectWithoutUserInput[]
    upsert?: CrashBetUpsertWithWhereUniqueWithoutUserInput | CrashBetUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CrashBetCreateManyUserInputEnvelope
    set?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
    disconnect?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
    delete?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
    connect?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
    update?: CrashBetUpdateWithWhereUniqueWithoutUserInput | CrashBetUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CrashBetUpdateManyWithWhereWithoutUserInput | CrashBetUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CrashBetScalarWhereInput | CrashBetScalarWhereInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CrashBetCreateNestedManyWithoutGameInput = {
    create?: XOR<CrashBetCreateWithoutGameInput, CrashBetUncheckedCreateWithoutGameInput> | CrashBetCreateWithoutGameInput[] | CrashBetUncheckedCreateWithoutGameInput[]
    connectOrCreate?: CrashBetCreateOrConnectWithoutGameInput | CrashBetCreateOrConnectWithoutGameInput[]
    createMany?: CrashBetCreateManyGameInputEnvelope
    connect?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
  }

  export type CrashBetUncheckedCreateNestedManyWithoutGameInput = {
    create?: XOR<CrashBetCreateWithoutGameInput, CrashBetUncheckedCreateWithoutGameInput> | CrashBetCreateWithoutGameInput[] | CrashBetUncheckedCreateWithoutGameInput[]
    connectOrCreate?: CrashBetCreateOrConnectWithoutGameInput | CrashBetCreateOrConnectWithoutGameInput[]
    createMany?: CrashBetCreateManyGameInputEnvelope
    connect?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CrashBetUpdateManyWithoutGameNestedInput = {
    create?: XOR<CrashBetCreateWithoutGameInput, CrashBetUncheckedCreateWithoutGameInput> | CrashBetCreateWithoutGameInput[] | CrashBetUncheckedCreateWithoutGameInput[]
    connectOrCreate?: CrashBetCreateOrConnectWithoutGameInput | CrashBetCreateOrConnectWithoutGameInput[]
    upsert?: CrashBetUpsertWithWhereUniqueWithoutGameInput | CrashBetUpsertWithWhereUniqueWithoutGameInput[]
    createMany?: CrashBetCreateManyGameInputEnvelope
    set?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
    disconnect?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
    delete?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
    connect?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
    update?: CrashBetUpdateWithWhereUniqueWithoutGameInput | CrashBetUpdateWithWhereUniqueWithoutGameInput[]
    updateMany?: CrashBetUpdateManyWithWhereWithoutGameInput | CrashBetUpdateManyWithWhereWithoutGameInput[]
    deleteMany?: CrashBetScalarWhereInput | CrashBetScalarWhereInput[]
  }

  export type CrashBetUncheckedUpdateManyWithoutGameNestedInput = {
    create?: XOR<CrashBetCreateWithoutGameInput, CrashBetUncheckedCreateWithoutGameInput> | CrashBetCreateWithoutGameInput[] | CrashBetUncheckedCreateWithoutGameInput[]
    connectOrCreate?: CrashBetCreateOrConnectWithoutGameInput | CrashBetCreateOrConnectWithoutGameInput[]
    upsert?: CrashBetUpsertWithWhereUniqueWithoutGameInput | CrashBetUpsertWithWhereUniqueWithoutGameInput[]
    createMany?: CrashBetCreateManyGameInputEnvelope
    set?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
    disconnect?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
    delete?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
    connect?: CrashBetWhereUniqueInput | CrashBetWhereUniqueInput[]
    update?: CrashBetUpdateWithWhereUniqueWithoutGameInput | CrashBetUpdateWithWhereUniqueWithoutGameInput[]
    updateMany?: CrashBetUpdateManyWithWhereWithoutGameInput | CrashBetUpdateManyWithWhereWithoutGameInput[]
    deleteMany?: CrashBetScalarWhereInput | CrashBetScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutCrashBetsInput = {
    create?: XOR<UserCreateWithoutCrashBetsInput, UserUncheckedCreateWithoutCrashBetsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCrashBetsInput
    connect?: UserWhereUniqueInput
  }

  export type CrashGameCreateNestedOneWithoutBetsInput = {
    create?: XOR<CrashGameCreateWithoutBetsInput, CrashGameUncheckedCreateWithoutBetsInput>
    connectOrCreate?: CrashGameCreateOrConnectWithoutBetsInput
    connect?: CrashGameWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutCrashBetsNestedInput = {
    create?: XOR<UserCreateWithoutCrashBetsInput, UserUncheckedCreateWithoutCrashBetsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCrashBetsInput
    upsert?: UserUpsertWithoutCrashBetsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCrashBetsInput, UserUpdateWithoutCrashBetsInput>, UserUncheckedUpdateWithoutCrashBetsInput>
  }

  export type CrashGameUpdateOneRequiredWithoutBetsNestedInput = {
    create?: XOR<CrashGameCreateWithoutBetsInput, CrashGameUncheckedCreateWithoutBetsInput>
    connectOrCreate?: CrashGameCreateOrConnectWithoutBetsInput
    upsert?: CrashGameUpsertWithoutBetsInput
    connect?: CrashGameWhereUniqueInput
    update?: XOR<XOR<CrashGameUpdateToOneWithWhereWithoutBetsInput, CrashGameUpdateWithoutBetsInput>, CrashGameUncheckedUpdateWithoutBetsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type CrashBetCreateWithoutUserInput = {
    id?: string
    amount: number
    cashedOutAt?: number | null
    winAmount?: number | null
    createdAt?: Date | string
    game: CrashGameCreateNestedOneWithoutBetsInput
  }

  export type CrashBetUncheckedCreateWithoutUserInput = {
    id?: string
    gameId: string
    amount: number
    cashedOutAt?: number | null
    winAmount?: number | null
    createdAt?: Date | string
  }

  export type CrashBetCreateOrConnectWithoutUserInput = {
    where: CrashBetWhereUniqueInput
    create: XOR<CrashBetCreateWithoutUserInput, CrashBetUncheckedCreateWithoutUserInput>
  }

  export type CrashBetCreateManyUserInputEnvelope = {
    data: CrashBetCreateManyUserInput | CrashBetCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CrashBetUpsertWithWhereUniqueWithoutUserInput = {
    where: CrashBetWhereUniqueInput
    update: XOR<CrashBetUpdateWithoutUserInput, CrashBetUncheckedUpdateWithoutUserInput>
    create: XOR<CrashBetCreateWithoutUserInput, CrashBetUncheckedCreateWithoutUserInput>
  }

  export type CrashBetUpdateWithWhereUniqueWithoutUserInput = {
    where: CrashBetWhereUniqueInput
    data: XOR<CrashBetUpdateWithoutUserInput, CrashBetUncheckedUpdateWithoutUserInput>
  }

  export type CrashBetUpdateManyWithWhereWithoutUserInput = {
    where: CrashBetScalarWhereInput
    data: XOR<CrashBetUpdateManyMutationInput, CrashBetUncheckedUpdateManyWithoutUserInput>
  }

  export type CrashBetScalarWhereInput = {
    AND?: CrashBetScalarWhereInput | CrashBetScalarWhereInput[]
    OR?: CrashBetScalarWhereInput[]
    NOT?: CrashBetScalarWhereInput | CrashBetScalarWhereInput[]
    id?: StringFilter<"CrashBet"> | string
    userId?: StringFilter<"CrashBet"> | string
    gameId?: StringFilter<"CrashBet"> | string
    amount?: IntFilter<"CrashBet"> | number
    cashedOutAt?: FloatNullableFilter<"CrashBet"> | number | null
    winAmount?: IntNullableFilter<"CrashBet"> | number | null
    createdAt?: DateTimeFilter<"CrashBet"> | Date | string
  }

  export type CrashBetCreateWithoutGameInput = {
    id?: string
    amount: number
    cashedOutAt?: number | null
    winAmount?: number | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutCrashBetsInput
  }

  export type CrashBetUncheckedCreateWithoutGameInput = {
    id?: string
    userId: string
    amount: number
    cashedOutAt?: number | null
    winAmount?: number | null
    createdAt?: Date | string
  }

  export type CrashBetCreateOrConnectWithoutGameInput = {
    where: CrashBetWhereUniqueInput
    create: XOR<CrashBetCreateWithoutGameInput, CrashBetUncheckedCreateWithoutGameInput>
  }

  export type CrashBetCreateManyGameInputEnvelope = {
    data: CrashBetCreateManyGameInput | CrashBetCreateManyGameInput[]
    skipDuplicates?: boolean
  }

  export type CrashBetUpsertWithWhereUniqueWithoutGameInput = {
    where: CrashBetWhereUniqueInput
    update: XOR<CrashBetUpdateWithoutGameInput, CrashBetUncheckedUpdateWithoutGameInput>
    create: XOR<CrashBetCreateWithoutGameInput, CrashBetUncheckedCreateWithoutGameInput>
  }

  export type CrashBetUpdateWithWhereUniqueWithoutGameInput = {
    where: CrashBetWhereUniqueInput
    data: XOR<CrashBetUpdateWithoutGameInput, CrashBetUncheckedUpdateWithoutGameInput>
  }

  export type CrashBetUpdateManyWithWhereWithoutGameInput = {
    where: CrashBetScalarWhereInput
    data: XOR<CrashBetUpdateManyMutationInput, CrashBetUncheckedUpdateManyWithoutGameInput>
  }

  export type UserCreateWithoutCrashBetsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    credits?: number
    lastDailyReward?: Date | string | null
    role?: string
  }

  export type UserUncheckedCreateWithoutCrashBetsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    credits?: number
    lastDailyReward?: Date | string | null
    role?: string
  }

  export type UserCreateOrConnectWithoutCrashBetsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCrashBetsInput, UserUncheckedCreateWithoutCrashBetsInput>
  }

  export type CrashGameCreateWithoutBetsInput = {
    id: string
    crashPoint: number
    startTime?: Date | string
    status: string
  }

  export type CrashGameUncheckedCreateWithoutBetsInput = {
    id: string
    crashPoint: number
    startTime?: Date | string
    status: string
  }

  export type CrashGameCreateOrConnectWithoutBetsInput = {
    where: CrashGameWhereUniqueInput
    create: XOR<CrashGameCreateWithoutBetsInput, CrashGameUncheckedCreateWithoutBetsInput>
  }

  export type UserUpsertWithoutCrashBetsInput = {
    update: XOR<UserUpdateWithoutCrashBetsInput, UserUncheckedUpdateWithoutCrashBetsInput>
    create: XOR<UserCreateWithoutCrashBetsInput, UserUncheckedCreateWithoutCrashBetsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCrashBetsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCrashBetsInput, UserUncheckedUpdateWithoutCrashBetsInput>
  }

  export type UserUpdateWithoutCrashBetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: IntFieldUpdateOperationsInput | number
    lastDailyReward?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
  }

  export type UserUncheckedUpdateWithoutCrashBetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: IntFieldUpdateOperationsInput | number
    lastDailyReward?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
  }

  export type CrashGameUpsertWithoutBetsInput = {
    update: XOR<CrashGameUpdateWithoutBetsInput, CrashGameUncheckedUpdateWithoutBetsInput>
    create: XOR<CrashGameCreateWithoutBetsInput, CrashGameUncheckedCreateWithoutBetsInput>
    where?: CrashGameWhereInput
  }

  export type CrashGameUpdateToOneWithWhereWithoutBetsInput = {
    where?: CrashGameWhereInput
    data: XOR<CrashGameUpdateWithoutBetsInput, CrashGameUncheckedUpdateWithoutBetsInput>
  }

  export type CrashGameUpdateWithoutBetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    crashPoint?: FloatFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type CrashGameUncheckedUpdateWithoutBetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    crashPoint?: FloatFieldUpdateOperationsInput | number
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type CrashBetCreateManyUserInput = {
    id?: string
    gameId: string
    amount: number
    cashedOutAt?: number | null
    winAmount?: number | null
    createdAt?: Date | string
  }

  export type CrashBetUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    cashedOutAt?: NullableFloatFieldUpdateOperationsInput | number | null
    winAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    game?: CrashGameUpdateOneRequiredWithoutBetsNestedInput
  }

  export type CrashBetUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    cashedOutAt?: NullableFloatFieldUpdateOperationsInput | number | null
    winAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrashBetUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    cashedOutAt?: NullableFloatFieldUpdateOperationsInput | number | null
    winAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrashBetCreateManyGameInput = {
    id?: string
    userId: string
    amount: number
    cashedOutAt?: number | null
    winAmount?: number | null
    createdAt?: Date | string
  }

  export type CrashBetUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    cashedOutAt?: NullableFloatFieldUpdateOperationsInput | number | null
    winAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCrashBetsNestedInput
  }

  export type CrashBetUncheckedUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    cashedOutAt?: NullableFloatFieldUpdateOperationsInput | number | null
    winAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrashBetUncheckedUpdateManyWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    cashedOutAt?: NullableFloatFieldUpdateOperationsInput | number | null
    winAmount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}