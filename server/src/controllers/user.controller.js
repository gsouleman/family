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
export var getUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.profile.findMany({
                        orderBy: { created_at: 'desc' }
                    })];
            case 1:
                users = _a.sent();
                res.json(users);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error fetching users:', error_1);
                res.status(500).json({ error: 'Failed to fetch users', details: String(error_1) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var createUserProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, email, full_name, role, account_type, status_1, phone, is_2fa_enabled, two_factor_method, user, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, id = _a.id, email = _a.email, full_name = _a.full_name, role = _a.role, account_type = _a.account_type, status_1 = _a.status, phone = _a.phone, is_2fa_enabled = _a.is_2fa_enabled, two_factor_method = _a.two_factor_method;
                return [4 /*yield*/, prisma.profile.upsert({
                        where: { id: id || 'unknown' }, // ID should come from Supabase Auth
                        update: {
                            full_name: full_name,
                            role: role,
                            account_type: account_type,
                            status: status_1,
                            email: email, // Allow updating email if changed
                            phone: phone,
                            is_2fa_enabled: is_2fa_enabled,
                            two_factor_method: two_factor_method
                        },
                        create: {
                            id: id,
                            email: email,
                            full_name: full_name,
                            role: role || 'user',
                            account_type: account_type || 'family',
                            status: status_1 || 'active',
                            phone: phone,
                            is_2fa_enabled: is_2fa_enabled,
                            two_factor_method: two_factor_method || 'email'
                        }
                    })];
            case 1:
                user = _b.sent();
                res.json(user);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('Error creating user profile:', error_2);
                res.status(500).json({ error: 'Failed to create user profile', details: String(error_2) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var updateUserProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, full_name, role, account_type, status_2, phone, is_2fa_enabled, two_factor_method, user, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, full_name = _a.full_name, role = _a.role, account_type = _a.account_type, status_2 = _a.status, phone = _a.phone, is_2fa_enabled = _a.is_2fa_enabled, two_factor_method = _a.two_factor_method;
                return [4 /*yield*/, prisma.profile.update({
                        where: { id: id },
                        data: {
                            full_name: full_name,
                            role: role,
                            account_type: account_type,
                            status: status_2,
                            phone: phone,
                            is_2fa_enabled: is_2fa_enabled,
                            two_factor_method: two_factor_method
                        }
                    })];
            case 1:
                user = _b.sent();
                res.json(user);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error('Error updating user profile:', error_3);
                res.status(500).json({ error: 'Failed to update user profile', details: String(error_3) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var deleteUserProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.profile.delete({
                        where: { id: id }
                    })];
            case 1:
                _a.sent();
                res.json({ message: 'User deleted successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error deleting user profile:', error_4);
                res.status(500).json({ error: 'Failed to delete user profile', details: String(error_4) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var getProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.userId;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: 'Unauthorized' })];
                }
                return [4 /*yield*/, prisma.profile.findUnique({
                        where: { id: userId }
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: 'Profile not found' })];
                }
                res.json(user);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error fetching profile:', error_5);
                res.status(500).json({ error: 'Failed to fetch profile', details: String(error_5) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
