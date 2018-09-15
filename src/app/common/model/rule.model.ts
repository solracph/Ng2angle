import { Constraint } from './constraint.model';

export class Rule {
    id: number;
    code: string;
    description: string;
    constraints: Array<Constraint>;
}