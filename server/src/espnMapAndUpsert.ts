import { PrismaClient } from "@prisma/client";
import {TeamSchema} from "./espn"
const prisma = new PrismaClient();

export default function upsertTeams(teams: unknown) {
    
}