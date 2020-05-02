<?php
class Php
{
    private $file;
    public function __construct(string $file)
    {
        $this->file = $file;
    }
    public function content()
    {
        $content = include($this->file);

        return json_encode($content);
    }
}
echo (new Php($argv[1]))->content();
