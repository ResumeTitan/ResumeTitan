package web

import "embed"

//go:embed *.html css js mock partials all:assets
var Files embed.FS
