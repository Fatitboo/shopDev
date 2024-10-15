package main

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func main() {
	// 1.
	// sugar := zap.NewExample().Sugar()
	// sugar.Infof("Hello name:%, age:%d", "TipsGo", 40)

	// logger := zap.NewExample()
	// logger.Info("Hello", zap.String("name", "TipsGo"), zap.Int("age", 40))

	// 2.
	// logger := zap.NewExample()
	// logger.Info("Hello NewExample")

	// // DEvelopment
	// logger, _ = zap.NewDevelopment()
	// logger.Info("Hello NewDevelopment")

	// // Production
	// logger, _ = zap.NewProduction()
	// logger.Info("Hello NewProduction")

	// 3.
	encoder := getEncoderLog()
	sync := getWriterSync()
	core := zapcore.NewCore(encoder, sync, zapcore.InfoLevel)
	logger := zap.New(core, zap.AddCaller())
	logger.Info("Log Info", zap.Int("Line", 12))
	logger.Error("Log Error", zap.Int("Line", 3))

}

// format log
func getEncoderLog() zapcore.Encoder {
	encoderConfig := zap.NewProductionEncoderConfig()

	encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder

	encoderConfig.TimeKey = "time"

	encoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder

	encoderConfig.EncodeCaller = zapcore.ShortCallerEncoder

	return zapcore.NewConsoleEncoder(encoderConfig)
}

// write log
func getWriterSync() zapcore.WriteSyncer {
	file, _ := os.OpenFile("./log/log.txt", os.O_CREATE|os.O_WRONLY, os.ModePerm)

	syncFile := zapcore.AddSync(file)

	syncConsole := zapcore.AddSync(os.Stderr)

	return zapcore.NewMultiWriteSyncer(syncConsole, syncFile)
}
