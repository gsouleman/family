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
export var userMiddleware = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userEmail, userName, existingProfile, nameToUse, dbError_1, firstUser, newUser, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                userId = req.headers['x-user-id'];
                userEmail = req.headers['x-user-email'];
                userName = req.headers['x-user-name'];
                if (!userId) return [3 /*break*/, 6];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                console.log("[Middleware] Syncing user ".concat(userId, " (Email: ").concat(userEmail, ", Name: ").concat(userName, ")"));
                return [4 /*yield*/, prisma.profile.findUnique({ where: { id: userId } })];
            case 2:
                existingProfile = _a.sent();
                console.log("[Middleware] Existing Profile before sync:", existingProfile);
                nameToUse = userName ? decodeURIComponent(userName) : '';
                if (!nameToUse && (existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.full_name)) {
                    nameToUse = existingProfile.full_name;
                }
                if (!nameToUse && userEmail === 'gsouleman@gmail.com') {
                    nameToUse = 'GHOUENZEN SOULEMANOU';
                }
                if (!nameToUse) {
                    nameToUse = userEmail || 'System User';
                }
                return [4 /*yield*/, prisma.user.upsert({
                        where: { id: userId },
                        update: {}, // No updates needed, Auth is source of truth
                        create: {
                            id: userId,
                            email: userEmail || "user_".concat(userId.substring(0, 8), "@example.com"),
                            fullName: nameToUse
                        }
                    })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                dbError_1 = _a.sent();
                console.error("Failed to sync user to Neon:", dbError_1);
                return [3 /*break*/, 5];
            case 5:
                req.userId = userId;
                return [3 /*break*/, 10];
            case 6: return [4 /*yield*/, prisma.user.findFirst()];
            case 7:
                firstUser = _a.sent();
                if (!firstUser) return [3 /*break*/, 8];
                req.userId = firstUser.id;
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, prisma.user.create({
                    data: {
                        email: 'dev@example.com',
                        fullName: 'Development User'
                    }
                })];
            case 9:
                newUser = _a.sent();
                req.userId = newUser.id;
                _a.label = 10;
            case 10:
                next();
                return [3 /*break*/, 12];
            case 11:
                error_1 = _a.sent();
                console.error('User middleware error:', error_1);
                next();
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
