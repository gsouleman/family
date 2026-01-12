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
export var getHeirs = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, heirs, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.userId;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: 'User authentication required' })];
                }
                return [4 /*yield*/, prisma.heir.findMany({
                        where: { userId: userId },
                        orderBy: { createdAt: 'desc' }
                    })];
            case 1:
                heirs = _a.sent();
                res.json(heirs);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error fetching heirs:', error_1);
                res.status(500).json({ error: 'Failed to fetch heirs' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var createHeir = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, name_1, relation, dateOfBirth, email, phone, avatar, heir, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = req.userId;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: 'User authentication required' })];
                }
                _a = req.body, name_1 = _a.name, relation = _a.relation, dateOfBirth = _a.dateOfBirth, email = _a.email, phone = _a.phone, avatar = _a.avatar;
                return [4 /*yield*/, prisma.heir.create({
                        data: {
                            name: name_1,
                            relation: relation,
                            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                            email: email,
                            phone: phone,
                            avatar: avatar,
                            userId: userId,
                        },
                    })];
            case 1:
                heir = _b.sent();
                res.json(heir);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('Error creating heir:', error_2);
                res.status(500).json({ error: 'Failed to create heir' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var updateHeir = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, _a, name_2, relation, dateOfBirth, email, phone, avatar, heir, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                userId = req.userId;
                _a = req.body, name_2 = _a.name, relation = _a.relation, dateOfBirth = _a.dateOfBirth, email = _a.email, phone = _a.phone, avatar = _a.avatar;
                return [4 /*yield*/, prisma.heir.update({
                        where: { id: id, userId: userId },
                        data: {
                            name: name_2,
                            relation: relation,
                            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                            email: email,
                            phone: phone,
                            avatar: avatar,
                        },
                    })];
            case 1:
                heir = _b.sent();
                res.json(heir);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error('Error updating heir:', error_3);
                res.status(500).json({ error: 'Failed to update heir' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var deleteHeir = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                userId = req.userId;
                return [4 /*yield*/, prisma.heir.delete({
                        where: { id: id, userId: userId },
                    })];
            case 1:
                _a.sent();
                res.json({ message: 'Heir deleted successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error deleting heir:', error_4);
                res.status(500).json({ error: 'Failed to delete heir' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
