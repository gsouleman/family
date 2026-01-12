var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import 'dotenv/config';
import prisma from './lib/prisma';
import { initialHeirs, initialDocuments } from '../../src/data/family';
import { AssetCategory, AssetStatus } from '@prisma/client';
var seedForUser = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userId, assets, _i, assets_1, asset, _a, initialHeirs_1, heir, id, data, _b, initialDocuments_1, doc, id, data, docTypeMap, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 14, 15, 17]);
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { email: email }
                    })];
            case 1:
                user = _c.sent();
                if (!user) {
                    console.error("User with email ".concat(email, " not found."));
                    process.exit(1);
                }
                userId = user.id;
                console.log("Seeding data for user: ".concat(user.email, " (").concat(userId, ")"));
                assets = [
                    { id: 'asset-1', name: 'Family Villa - Palm Jumeirah', value: 4500000, category: AssetCategory.property, status: AssetStatus.active },
                    { id: 'asset-2', name: 'Downtown Apartment', value: 1200000, category: AssetCategory.property, status: AssetStatus.active },
                    { id: 'asset-4', name: 'Investment Portfolio', value: 850000, category: AssetCategory.investment, status: AssetStatus.active },
                    { id: 'asset-5', name: 'Sukuk Bonds', value: 500000, category: AssetCategory.investment, status: AssetStatus.active },
                    { id: 'asset-6', name: 'Mercedes-Benz S-Class', value: 180000, category: AssetCategory.vehicle, status: AssetStatus.active },
                    { id: 'asset-9', name: 'Jewelry Collection', value: 250000, category: AssetCategory.other, status: AssetStatus.active },
                    { id: 'asset-12', name: 'Trading Co LLC', value: 2000000, category: AssetCategory.business, status: AssetStatus.active },
                    { id: 'asset-16', name: 'Beach House - Maldives', value: 2100000, category: AssetCategory.property, status: AssetStatus.active },
                    { id: 'asset-17', name: 'Family Yacht', value: 750000, category: AssetCategory.vehicle, status: AssetStatus.active },
                ];
                _i = 0, assets_1 = assets;
                _c.label = 2;
            case 2:
                if (!(_i < assets_1.length)) return [3 /*break*/, 5];
                asset = assets_1[_i];
                return [4 /*yield*/, prisma.asset.upsert({
                        where: { id: asset.id },
                        update: { userId: userId }, // Transfer ownership if exists
                        create: {
                            id: asset.id,
                            name: asset.name,
                            value: asset.value,
                            category: asset.category,
                            status: asset.status,
                            userId: userId,
                            description: 'Seeded asset',
                            location: 'Dubai, UAE',
                            isForSale: true
                        }
                    })];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                console.log("Verifying/Seeding ".concat(assets.length, " assets... Done."));
                _a = 0, initialHeirs_1 = initialHeirs;
                _c.label = 6;
            case 6:
                if (!(_a < initialHeirs_1.length)) return [3 /*break*/, 9];
                heir = initialHeirs_1[_a];
                id = heir.id, data = __rest(heir, ["id"]);
                // Map frontend relation to backend enum if needed, or keep string if flexible
                // Backend Heir model might differ slightly.
                // Let's assume schema matches for now or use 'other'
                return [4 /*yield*/, prisma.heir.upsert({
                        where: { id: id },
                        update: { userId: userId },
                        create: {
                            id: id,
                            name: data.name,
                            relation: data.relation,
                            email: data.email,
                            phone: data.phone,
                            dateOfBirth: new Date(data.dateOfBirth),
                            userId: userId,
                            avatar: data.avatar
                        }
                    })];
            case 7:
                // Map frontend relation to backend enum if needed, or keep string if flexible
                // Backend Heir model might differ slightly.
                // Let's assume schema matches for now or use 'other'
                _c.sent();
                _c.label = 8;
            case 8:
                _a++;
                return [3 /*break*/, 6];
            case 9:
                console.log("Verifying/Seeding ".concat(initialHeirs.length, " heirs... Done."));
                _b = 0, initialDocuments_1 = initialDocuments;
                _c.label = 10;
            case 10:
                if (!(_b < initialDocuments_1.length)) return [3 /*break*/, 13];
                doc = initialDocuments_1[_b];
                id = doc.id, data = __rest(doc, ["id"]);
                docTypeMap = { 'will': 'other', 'deed': 'deed', 'certificate': 'certificate', 'other': 'other' };
                return [4 /*yield*/, prisma.document.upsert({
                        where: { id: id },
                        update: { userId: userId },
                        create: {
                            id: id,
                            name: data.name,
                            type: docTypeMap[data.type] || 'other',
                            url: 'https://example.com/doc.pdf', // Mock URL
                            userId: userId,
                            assetId: data.relatedAssetId
                        }
                    })];
            case 11:
                _c.sent();
                _c.label = 12;
            case 12:
                _b++;
                return [3 /*break*/, 10];
            case 13:
                console.log("Verifying/Seeding ".concat(initialDocuments.length, " documents... Done."));
                console.log('Seeding completed successfully.');
                return [3 /*break*/, 17];
            case 14:
                error_1 = _c.sent();
                console.error('Seeding failed:', error_1);
                return [3 /*break*/, 17];
            case 15: return [4 /*yield*/, prisma.$disconnect()];
            case 16:
                _c.sent();
                return [7 /*endfinally*/];
            case 17: return [2 /*return*/];
        }
    });
}); };
var email = process.argv[2];
if (!email) {
    console.error('Please provide an email argument.');
    process.exit(1);
}
seedForUser(email);
