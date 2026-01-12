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
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import assetRoutes from './routes/assets.routes';
import heirRoutes from './routes/heirs.routes';
import documentRoutes from './routes/documents.routes';
import transactionRoutes from './routes/transactions.routes';
import distributionRoutes from './routes/distributions.routes';
import notificationRoutes from './routes/notifications.routes';
import ledgerRoutes from './routes/ledger.routes';
import userRoutes from './routes/users.routes';
import seedRoutes from './routes/seed.routes';
var app = express();
var port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
import { errorHandler } from './middleware/error.middleware';
import { userMiddleware } from './middleware/user.middleware';
// Apply user middleware essentially globally or to specific routes
app.use(userMiddleware);
app.use('/api/assets', assetRoutes);
app.use('/api/heirs', heirRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/distributions', distributionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/seed', seedRoutes);
app.use(errorHandler);
app.get('/', function (req, res) {
    res.send('Family Assets Sharing API is running');
});
app.get('/api/health', function (req, res) {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
import prisma from './lib/prisma';
app.get('/api/debug/db', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var dbUrlExists, dbUrlSafe, userCount, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, 4, 6]);
                dbUrlExists = !!process.env.DATABASE_URL;
                dbUrlSafe = dbUrlExists ? (((_a = process.env.DATABASE_URL) === null || _a === void 0 ? void 0 : _a.substring(0, 20)) + '...') : 'MISSING';
                return [4 /*yield*/, prisma.$connect()];
            case 1:
                _b.sent();
                return [4 /*yield*/, prisma.user.count()];
            case 2:
                userCount = _b.sent();
                res.json({
                    status: 'connected',
                    env_database_url: dbUrlExists ? 'PRESENT' : 'MISSING',
                    url_preview: dbUrlSafe,
                    user_count: userCount
                });
                return [3 /*break*/, 6];
            case 3:
                error_1 = _b.sent();
                console.error('DB Debug Connection Failed:', error_1);
                res.status(500).json({
                    status: 'failed',
                    env_database_url: !!process.env.DATABASE_URL ? 'PRESENT' : 'MISSING',
                    error: error_1.message
                });
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, prisma.$disconnect()];
            case 5:
                _b.sent();
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("Server is running at http://localhost:".concat(port));
});
