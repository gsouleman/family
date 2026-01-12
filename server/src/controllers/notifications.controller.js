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
export var getNotifications = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var notifications, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.notification.findMany({
                        orderBy: { date: 'desc' },
                        include: { user: false } // Avoid leaking user data if not needed
                    })];
            case 1:
                notifications = _a.sent();
                res.json(notifications);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({
                    error: 'Failed to fetch notifications',
                    debug_message: error_1.message,
                    debug_stack: error_1.stack
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var createNotification = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, message, type, userId, targetUserId, user, notification, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, title = _a.title, message = _a.message, type = _a.type, userId = _a.userId;
                targetUserId = userId;
                if (!!targetUserId) return [3 /*break*/, 2];
                return [4 /*yield*/, prisma.user.findFirst()];
            case 1:
                user = _b.sent();
                if (user)
                    targetUserId = user.id;
                _b.label = 2;
            case 2:
                if (!targetUserId) {
                    return [2 /*return*/, res.status(400).json({ error: 'User ID required for notification via fallback' })];
                }
                return [4 /*yield*/, prisma.notification.create({
                        data: {
                            title: title,
                            message: message,
                            type: type,
                            userId: targetUserId
                        }
                    })];
            case 3:
                notification = _b.sent();
                res.json(notification);
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error(error_2);
                res.status(500).json({ error: 'Failed to create notification' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
export var markRead = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, notification, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.notification.update({
                        where: { id: id },
                        data: { read: true }
                    })];
            case 1:
                notification = _a.sent();
                res.json(notification);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({ error: 'Failed to mark notification as read' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
