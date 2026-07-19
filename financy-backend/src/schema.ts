import "./modules/user/types.js";
import "./modules/user/mutations.js";
import "./modules/category/types.js";
import "./modules/category/queries.js";
import "./modules/category/mutations.js";
import "./modules/transaction/types.js";
import "./modules/transaction/queries.js";
import "./modules/transaction/mutations.js";
import "./modules/dashboard/types.js";
import "./modules/dashboard/queries.js";

import { builder } from "./builder.js";

export const schema = builder.toSchema();
