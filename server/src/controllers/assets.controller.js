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
export var getAssets = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, assets, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.userId;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: 'User authentication required' })];
                }
                return [4 /*yield*/, prisma.asset.findMany({
                        where: { userId: userId },
                        orderBy: { createdAt: 'desc' },
                        include: { documents: true }
                    })];
            case 1:
                assets = _a.sent();
                res.json(assets);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error fetching assets:', error_1);
                res.status(500).json({
                    error: 'Failed to fetch assets',
                    debug_message: error_1.message,
                    debug_stack: error_1.stack
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var createAsset = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, name_1, category, value, description, location_1, purchaseDate, image, status_1, isForSale, asset, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = req.userId;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: 'User authentication required' })];
                }
                _a = req.body, name_1 = _a.name, category = _a.category, value = _a.value, description = _a.description, location_1 = _a.location, purchaseDate = _a.purchaseDate, image = _a.image, status_1 = _a.status, isForSale = _a.isForSale;
                // Validate Enum values
                if (category && !Object.values(AssetCategory).includes(category)) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid asset category' })];
                }
                return [4 /*yield*/, prisma.asset.create({
                        data: {
                            name: name_1,
                            category: category,
                            value: parseFloat(value),
                            description: description,
                            location: location_1,
                            purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
                            image: image,
                            status: status_1 || AssetStatus.active,
                            isForSale: isForSale !== undefined ? Boolean(isForSale) : true,
                            userId: userId,
                        },
                    })];
            case 1:
                asset = _b.sent();
                res.json(asset);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('Error creating asset:', error_2);
                res.status(500).json({ error: 'Failed to create asset' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var updateAsset = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, _a, name_2, category, value, description, location_2, purchaseDate, image, status_2, isForSale, asset, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                userId = req.userId;
                _a = req.body, name_2 = _a.name, category = _a.category, value = _a.value, description = _a.description, location_2 = _a.location, purchaseDate = _a.purchaseDate, image = _a.image, status_2 = _a.status, isForSale = _a.isForSale;
                return [4 /*yield*/, prisma.asset.update({
                        where: { id: id, userId: userId }, // Ensure user owns the asset
                        data: {
                            name: name_2,
                            category: category,
                            value: value ? parseFloat(value) : undefined,
                            description: description,
                            location: location_2,
                            purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
                            image: image,
                            status: status_2,
                            isForSale: isForSale !== undefined ? Boolean(isForSale) : undefined,
                        },
                    })];
            case 1:
                asset = _b.sent();
                res.json(asset);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error('Error updating asset:', error_3);
                res.status(500).json({ error: 'Failed to update asset' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var deleteAsset = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                userId = req.userId;
                return [4 /*yield*/, prisma.asset.delete({
                        where: { id: id, userId: userId }, // Ensure user owns the asset
                    })];
            case 1:
                _a.sent();
                res.json({ message: 'Asset deleted successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error deleting asset:', error_4);
                res.status(500).json({ error: 'Failed to delete asset' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
