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
import prisma from '../lib/prisma';
import { AssetCategory, AssetStatus } from '@prisma/client';
export var seedData = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, assets, heirs, documents, notifications, _i, assets_1, asset, _a, heirs_1, heir, _b, documents_1, doc, _c, notifications_1, notif, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 17, , 18]);
                userId = req.userId;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: 'User authentication required' })];
                }
                console.log("Seeding data for user: ".concat(userId));
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
                heirs = [
                    { id: 'heir-1', name: 'Fatima Al-Rahman', relation: 'spouse_wife', email: 'fatima@family.com', phone: '+971 50 123 4567', dateOfBirth: '1975-03-15', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
                    { id: 'heir-2', name: 'Ahmed Al-Rahman', relation: 'son', email: 'ahmed@family.com', phone: '+971 50 234 5678', dateOfBirth: '1998-08-22', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
                    { id: 'heir-3', name: 'Omar Al-Rahman', relation: 'son', email: 'omar@family.com', phone: '+971 50 345 6789', dateOfBirth: '2001-11-05', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
                    { id: 'heir-4', name: 'Layla Al-Rahman', relation: 'daughter', email: 'layla@family.com', phone: '+971 50 456 7890', dateOfBirth: '2003-06-18', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
                    { id: 'heir-5', name: 'Sara Al-Rahman', relation: 'daughter', email: 'sara@family.com', phone: '+971 50 567 8901', dateOfBirth: '2006-02-28', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80' },
                ];
                documents = [
                    { id: 'doc-1', name: 'Family Will - 2024 Update', type: 'will', uploadDate: '2024-01-15' },
                    { id: 'doc-2', name: 'Palm Jumeirah Villa - Title Deed', type: 'deed', relatedAssetId: 'asset-1' },
                    { id: 'doc-7', name: 'Investment Portfolio Statement', type: 'other', relatedAssetId: 'asset-4' }
                ];
                notifications = [
                    { id: 'notif-1', title: 'Welcome to Family Assets', message: 'Your dashboard has been populated with demo data.', date: new Date().toISOString().split('T')[0], read: false, type: 'general' }
                ];
                _i = 0, assets_1 = assets;
                _d.label = 1;
            case 1:
                if (!(_i < assets_1.length)) return [3 /*break*/, 4];
                asset = assets_1[_i];
                return [4 /*yield*/, prisma.asset.upsert({
                        where: { id: asset.id },
                        update: { userId: userId },
                        create: {
                            id: asset.id,
                            name: asset.name,
                            value: asset.value,
                            category: asset.category,
                            status: asset.status,
                            userId: userId,
                            description: 'Demo ' + asset.name,
                            location: 'Dubai, UAE',
                            isForSale: true
                        }
                    })];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                _a = 0, heirs_1 = heirs;
                _d.label = 5;
            case 5:
                if (!(_a < heirs_1.length)) return [3 /*break*/, 8];
                heir = heirs_1[_a];
                return [4 /*yield*/, prisma.heir.upsert({
                        where: { id: heir.id },
                        update: { userId: userId },
                        create: {
                            id: heir.id,
                            name: heir.name,
                            relation: heir.relation,
                            email: heir.email,
                            phone: heir.phone,
                            dateOfBirth: new Date(heir.dateOfBirth),
                            userId: userId,
                            avatar: heir.avatar
                        }
                    })];
            case 6:
                _d.sent();
                _d.label = 7;
            case 7:
                _a++;
                return [3 /*break*/, 5];
            case 8:
                _b = 0, documents_1 = documents;
                _d.label = 9;
            case 9:
                if (!(_b < documents_1.length)) return [3 /*break*/, 12];
                doc = documents_1[_b];
                return [4 /*yield*/, prisma.document.upsert({
                        where: { id: doc.id },
                        update: { userId: userId },
                        create: {
                            id: doc.id,
                            name: doc.name,
                            type: doc.type,
                            url: 'https://example.com/demo.pdf',
                            userId: userId,
                            assetId: doc.relatedAssetId
                        }
                    })];
            case 10:
                _d.sent();
                _d.label = 11;
            case 11:
                _b++;
                return [3 /*break*/, 9];
            case 12:
                _c = 0, notifications_1 = notifications;
                _d.label = 13;
            case 13:
                if (!(_c < notifications_1.length)) return [3 /*break*/, 16];
                notif = notifications_1[_c];
                return [4 /*yield*/, prisma.notification.create({
                        data: {
                            title: notif.title,
                            message: notif.message,
                            date: new Date(notif.date),
                            read: notif.read,
                            type: notif.type,
                            userId: userId
                        }
                    })];
            case 14:
                _d.sent();
                _d.label = 15;
            case 15:
                _c++;
                return [3 /*break*/, 13];
            case 16:
                res.json({ message: 'Demo data seeded successfully' });
                return [3 /*break*/, 18];
            case 17:
                error_1 = _d.sent();
                console.error('Seeding failed:', error_1);
                res.status(500).json({ error: 'Failed to seed data' });
                return [3 /*break*/, 18];
            case 18: return [2 /*return*/];
        }
    });
}); };
