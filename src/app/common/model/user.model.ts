import { Rule } from './rule.model'
export class User {
    id: number;
    name: string;
    rules: Array<Rule>;
}